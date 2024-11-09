import express from 'express';
import {random, authentication } from "../helpers";
import { getUsersByEmail, createUser } from '../db/users';

export const login = async(req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.sendStatus(400);
        }
        
        //we add .select(), this is very IMPORTANT
        const user = await getUsersByEmail(email).select('+authentication.salt +authentication.password');

        if (!user) {
            return res.sendStatus(400)
        }

        //校验密码hash一致
        const expectedHash = authentication(user.authentication.salt, password);
        if(user.authentication.password !== expectedHash){
            return res.sendStatus(403);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie('YUMING-AUTH', user.authentication.sessionToken, {domain: 'localhost', path: '/'});
        console.log("successfully login!")
        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const register = async(req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } =req.body
        
        if(!email || !password || !username) {
            return res.sendStatus(400);
        }

        const existingUser = await getUsersByEmail(email);
        if (existingUser) {
            return res.sendStatus(400);
        }

        const salt = random();
        const user = await createUser({
            email, 
            username, 
            authentication: {
                salt,
                password: authentication(salt, password),
            }
        })

        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
