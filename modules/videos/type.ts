import { AppRouter } from '@/trpc/routers/_app';
import { inferRouterOutputs } from '@trpc/server';

export type VideoGetOneOutput = inferRouterOutputs<AppRouter>['videos']['getOne'];
export type VIdeoGetManyOutput = inferRouterOutputs<AppRouter>['suggestions']['getMany'];
