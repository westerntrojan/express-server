import {PubSub} from 'apollo-server-express';

import {IValidUser} from '../models/User';

export type Context = {
	pubsub: PubSub;
	user: IValidUser | null;
};
