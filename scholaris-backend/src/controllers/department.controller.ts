import crypto from 'crypto'
import db from '@/drizzle/db.js'
import { departments } from '@/drizzle/schema.js'
import { NotFoundError, BadRequestError } from '@/errors/index.js'
import type { Department } from '@/types/global.js'
import { eq, sql } from 'drizzle-orm'
import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

export const createDepartment = async (
  req: Request<unknown, unknown, Department>,
  res: Response,
) => {
  const { name, schoolId } = req.body

  try {
    const [newDepartment] = await db
      .insert(departments)
      .values({ id: crypto.randomUUID(), schoolId, name })
      .returning()

    if (!newDepartment) {
      throw new BadRequestError('Failed to create department')
    }

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: newDepartment,
      message: 'Department created successfully',
    })
  } catch (error) {
    if (
      (error as any)?.code === '23505' ||
      (error as any)?.message?.includes('unique')
    ) {
      throw new BadRequestError('Department already exists')
    }
    throw error
  }
}

export const getDepartment = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const department = await db.query.departments.findFirst({
    where: (fields, { eq }) => eq(fields.id, req.params.id),
  })

  if (!department) {
    throw new NotFoundError('Department not found')
  }

  res.status(StatusCodes.OK).json({ success: true, data: department })
}

// FIX: renamed local variable to `allDepartments` to avoid shadowing the imported schema
export const getAllDepartments = async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1)
  const limit = Number(req.query.limit ?? 20)
  const schoolId =
    typeof req.query.schoolId === 'string' ? req.query.schoolId : undefined
  const maxLimit = 100

  if (
    Number.isNaN(page) ||
    !Number.isInteger(page) ||
    page < 1 ||
    Number.isNaN(limit) ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > maxLimit
  ) {
    throw new BadRequestError('Invalid pagination parameters')
  }

  const skip = (page - 1) * limit
  const [{ total }] = await db
    .select({ total: sql`count(*)` })
    .from(departments)
    .where(
      schoolId ? (fields, { eq }) => eq(fields.schoolId, schoolId) : undefined,
    )

  const allDepartments = await db.query.departments.findMany({
    where: schoolId
      ? (fields, { eq }) => eq(fields.schoolId, schoolId)
      : undefined,
    orderBy: (fields, { asc }) => asc(fields.createdAt),
    limit,
    offset: skip,
  })

  res.status(StatusCodes.OK).json({
    success: true,
    data: allDepartments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      ...(schoolId ? { schoolId } : {}),
    },
  })
}

export const updateDepartment = async (
  req: Request<{ id: string }, unknown, Department>,
  res: Response,
) => {
  const department = await db.query.departments.findFirst({
    where: (fields, { eq }) => eq(fields.id, req.params.id),
  })

  // FIX: corrected error message from "already exists" to "not found"
  if (!department) {
    throw new NotFoundError('Department not found')
  }

  const updatePayload: Partial<Department> = {}
  if (req.body.name !== undefined) updatePayload.name = req.body.name
  if (req.body.schoolId !== undefined)
    updatePayload.schoolId = req.body.schoolId

  if (Object.keys(updatePayload).length === 0) {
    throw new BadRequestError('No updateable fields provided')
  }

  const candidateName = updatePayload.name ?? department.name
  const candidateSchoolId = updatePayload.schoolId ?? department.schoolId

  if (
    updatePayload.name !== undefined ||
    updatePayload.schoolId !== undefined
  ) {
    const duplicate = await db.query.departments.findFirst({
      where: (fields, { and, eq, ne }) =>
        and(
          eq(fields.schoolId, candidateSchoolId),
          eq(fields.name, candidateName),
          ne(fields.id, req.params.id),
        ),
    })

    if (duplicate) {
      throw new BadRequestError('Department already exists')
    }
  }

  const [updatedDepartment] = await db
    .update(departments)
    .set(updatePayload)
    .where(eq(departments.id, req.params.id))
    .returning()

  if (!updatedDepartment) {
    throw new BadRequestError('Failed to update the department')
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: updatedDepartment,
    message: 'Updated successfully',
  })
}

export const deleteDepartment = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const department = await db.query.departments.findFirst({
    where: (fields, { eq }) => eq(fields.id, req.params.id),
  })

  if (!department) {
    throw new NotFoundError('Department not found')
  }

  // FIX: db.delete() never returns null — existence check above is the correct guard.
  // We just execute the delete and trust it succeeded since we confirmed the row exists.
  await db.delete(departments).where(eq(departments.id, req.params.id))

  // FIX: 204 No Content must not have a body — send() instead of json()
  res.status(StatusCodes.NO_CONTENT).send()
}
