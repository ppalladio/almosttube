import { CategoriesRouter } from '@/modules/categories/server/procedures';
import { CommentReactionRouter } from '@/modules/comment-reactions/server/procedures';
import { CommentRouter } from '@/modules/comments/server/procedures';
import { PlaylistRouter } from '@/modules/playlist/server/procedures';
import { SearchRouter } from '@/modules/search/server/procedures';
import { StudioRouter } from '@/modules/studio/server/procedures';
import { SubscriptionRouter } from '@/modules/subscriptions/server/procedures';
import { SuggestionRouter } from '@/modules/suggestions/server/procedures';
import { VideoReactionRouter } from '@/modules/video-reactions/server/procedures';
import { VideoViewRouter } from '@/modules/video-views/server/procedures';
import { VideoRouter } from '@/modules/videos/server/procedures';
import { createTRPCRouter } from '../init';
import { UsersRouter } from '@/modules/users/server/procedures';
export const appRouter = createTRPCRouter({
    categories: CategoriesRouter,
    studio: StudioRouter,
    videos: VideoRouter,
    videoViews: VideoViewRouter,
    videoReactions: VideoReactionRouter,
    subscription: SubscriptionRouter,
    comments: CommentRouter,
    commentReactions: CommentReactionRouter,
    suggestions: SuggestionRouter,
    search: SearchRouter,
    playlist: PlaylistRouter,
	users:UsersRouter

});
// export type definition of API
export type AppRouter = typeof appRouter;
