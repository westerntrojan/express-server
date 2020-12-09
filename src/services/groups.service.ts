import randomColor from 'randomcolor';

import Group, {IGroup} from '../models/Group';

class GroupsService {
	async getUserGroups({userId}: {userId: string}): Promise<{groups: IGroup[]}> {
		const groups = await Group.find({members: userId});

		return {groups};
	}

	async create({data}: {data: IGroup}): Promise<{group: IGroup}> {
		const group = new Group(data);
		group.avatar.color = randomColor({luminosity: 'dark', format: 'rgb'});
		group.save();

		return {group};
	}
}

export default new GroupsService();
