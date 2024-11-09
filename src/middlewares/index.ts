import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../db/users';

export const isOwner = async(req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if(!currentUserId) {
            res.sendStatus(400);
            return;
        }

        if (currentUserId.toString() !== id){
            console.log('检测到非本人删除请求')
            res.sendStatus(403);
            return;
        }

        next();
    } catch (error) {
        console.log(error)
        res.sendStatus(400);
        return;
    }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['YUMING-AUTH'];

        if (!sessionToken) {
            res.sendStatus(403);
            return ;
        }

        const existingUser = await getUserBySessionToken(sessionToken);
        
        if(!existingUser){
            res.sendStatus(403);
            return ;
        }

        merge(req, {identity: existingUser});

        return next();
    } catch (error) {
        console.log(error);
        res.sendStatus(403);
        return ;
    }
}