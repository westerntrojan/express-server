import {PubSub} from 'apollo-server-express';

export type Context = {
	pubsub: PubSub;
	isAuth: boolean;
};
