import {Request, Response, NextFunction} from 'express';

import GroupsService from '../services/groups.service';

class GroupsController {
	async getUserGroups(req: Request, res: Response, next: NextFunction) {
		try {
			const {groups} = await GroupsService.getUserGroups({userId: req.params.userId});

			res.json({success: true, groups});
		} catch (err) {
			next(err);
		}
	}

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const {group} = await GroupsService.create({data: req.body});

			res.json({success: true, group});
		} catch (err) {
			next(err);
		}
	}
}

export default new GroupsController();
