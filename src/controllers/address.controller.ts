/**********************************
 * address.controller.ts
 **********************************/
import { RequestHandler } from 'express';
import * as addressService from '../services/address.service';

export const createAddressController: RequestHandler = async (req, res, next) => {
  try {
    const addressId = await addressService.createAddress(req.body);
    res.status(201).json({ addressId });
  } catch (err) {
    next(err);
  }
};
