// controllers/citizenAttrib.controller.ts
import { RequestHandler } from 'express';
import * as citizenAttribService from '../services/citizenAttrib.service';

/**
 * CREATE
 * POST /api/citizen-attrib
 */
export const createCitizenAttribController: RequestHandler = async (req, res, next) => {
  try {
    const newId = await citizenAttribService.createCitizenAttrib(req.body);
    res.status(201).json({ id: newId, message: 'Citizen Attrib created successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * READ
 * GET /api/citizen-attrib/:citizenId
 * Example: /api/citizen-attrib/10
 * Looks up the row in citizen_attrib by "citizens_gov_id = 10"
 */
export const getCitizenAttribByCitizenController: RequestHandler = async (req, res, next) => {
  try {
    const citizenId = Number(req.params.citizenId);
    const result = await citizenAttribService.getCitizenAttribByCitizenId(citizenId);

    if (!result) {
      res.status(404).json({ error: 'No attributes found for this citizen' });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE
 * PATCH /api/citizen-attrib/:attribId
 * Partially updates the row in "citizen_attrib" by citizen_attrib_id
 */
export const updateCitizenAttribController: RequestHandler = async (req, res, next) => {
  try {
    const attribId = Number(req.params.attribId);
    const updated = await citizenAttribService.updateCitizenAttrib(attribId, req.body);

    if (!updated) {
      res.status(404).json({ error: 'Record not found or no fields updated' });
      return;
    }

    res.json({ message: 'Citizen attrib updated', data: updated });
  } catch (error) {
    next(error);
  }
};
