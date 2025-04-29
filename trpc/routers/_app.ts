import { CategoriesRouter } from '@/modules/categories/server/procedures';
import { createTRPCRouter } from '../init';
import { StudioRouter } from '@/modules/studio/server/procedures';
import { VideoRouter } from '@/modules/videos/server/procedures';
import { VideoViewRouter } from '@/modules/video-views/server/procedures';
import { VideoReactionRouter } from '@/modules/video-reactions/server/procedures';
export const appRouter = createTRPCRouter({
    categories: CategoriesRouter,
    studio: StudioRouter,
    videos: VideoRouter,
    videoViews: VideoViewRouter,
	videoReactions: VideoReactionRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
