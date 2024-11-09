import express from 'express';

import { register, login } from '../controllers/authentication';

export default (router: express.Router) => {
    router.post('/auth/register', register as unknown as (req: express.Request, res: express.Response) => void); 
    router.post('/auth/login', login as unknown as (req: express.Request, res: express.Response) => void)
}