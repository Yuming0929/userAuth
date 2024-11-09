import express from 'express';

import { deleteUserById, getUserById, getUsers, updateUserById } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        res.status(200).json(users);
        
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const deletedUser = await deleteUserById(id);

        res.json(deletedUser);
        
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        if(!username){
            res.sendStatus(400);
            return;
        }
        const user = await getUserById(id);
        if (!user) {
            res.sendStatus(404); // 用户未找到
            return;
        }
        user.username = username;

        await user.save();

        res.status(200).json(user).end();
        
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}