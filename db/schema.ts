import { relations } from 'drizzle-orm';
import { foreignKey, integer, pgEnum, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
export const reactionType = pgEnum('reaction_type', ['like', 'dislike']);

// playlist
export const playlistVideos = pgTable(
    'playlist_videos',
    {
        playlistId: uuid('playlist_id')
            .references(() => playlists.id, { onDelete: 'cascade' })
            .notNull(),
        videoId: uuid('video_id')
            .references(() => videos.id, { onDelete: 'cascade' })
            .notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (t) => [
        primaryKey({
            name: 'playlist_videos_pkey',
            columns: [t.playlistId, t.videoId],
        }),
    ],
);

export const playlists = pgTable('playlists', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    userId: uuid('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const playlistVideoRelations = relations(playlistVideos, ({ one }) => ({
    playlist: one(playlists, { fields: [playlistVideos.playlistId], references: [playlists.id] }),
    video: one(videos, { fields: [playlistVideos.videoId], references: [videos.id] }),
}));
export const playlistRelations = relations(playlists, ({ one, many }) => ({
    user: one(users, { fields: [playlists.userId], references: [users.id] }),
    playlistVideos: many(playlistVideos),
}));

// users
export const users = pgTable(
    'users',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        clerkId: text('clerk_id').unique().notNull(),
        name: text('name').notNull(),
		bannerUrl:text('banner_url'),
		bannerKey:text('banner_key'),
        imageUrl: text('image_url').notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (t) => [uniqueIndex('clerk_id_idx').on(t.clerkId)],
);

export const userRelations = relations(users, ({ many }) => ({
    videos: many(videos),
    videoViews: many(videoViews),
    videoReactions: many(videoReactions),
    comments: many(comments),
    subscriptions: many(subscriptions, { relationName: 'subscriptions_viewerId_fkey' }),
    subscribers: many(subscriptions, { relationName: 'subscriptions_creatorId_fkey' }),
    commentReactions: many(commentReactions),
    playlists: many(playlists),
}));

// subscriptions
export const subscriptions = pgTable(
    'subscriptions',
    {
        viewerId: uuid('viewer_id')
            .references(() => users.id, {
                onDelete: 'cascade',
            })
            .notNull(),
        creatorId: uuid('creator_id')
            .references(() => users.id, { onDelete: 'cascade' })
            .notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (t) => [
        primaryKey({
            name: 'subscriptions_pkey',
            columns: [t.viewerId, t.creatorId],
        }),
    ],
);

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
    viewer: one(users, {
        fields: [subscriptions.viewerId],
        references: [users.id],
        relationName: 'subscriptions_viewerId_fkey',
    }),
    creator: one(users, {
        fields: [subscriptions.creatorId],
        references: [users.id],
        relationName: 'subscriptions_creatorId_fkey',
    }),
}));

// categories
export const categories = pgTable(
    'categories',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        name: text('name').notNull().unique(),
        description: text('description'),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (t) => [uniqueIndex('name_idx').on(t.name)],
);

export const categoryRelations = relations(categories, ({ many }) => ({
    videos: many(videos),
}));

// Videos
export const videoVisibility = pgEnum('video_visibility', ['private', 'public']);

export const videos = pgTable('videos', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    description: text('description'),
    // data from mux
    muxStatus: text('mux_status'),
    muxAssetId: text('mux_asset_id').unique(),
    muxUploadId: text('mux_upload_id').unique(),
    muxPlaybackId: text('mux_playback_id').unique(),
    muxTrackId: text('mux_track_id').unique(),
    muxTrackStatus: text('mux_track_status'),
    muxThumbnailUrl: text('mux_thumbnail_url'),
    muxThumbnailKey: text('mux_thumbnail_key'),
    muxPreviewUrl: text('mux_preview_url'),
    muxPreviewKey: text('mux_preview_key'),
    duration: integer('duration').default(0).notNull(),
    visibility: videoVisibility('visibility').default('private').notNull(),
    userId: uuid('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export const videoSelectSchema = createSelectSchema(videos);
export const videoUpdateSchema = createUpdateSchema(videos);
export const videoInsertSchema = createInsertSchema(videos);

export const videoRelations = relations(videos, ({ one, many }) => ({
    user: one(users, { fields: [videos.userId], references: [users.id] }),
    category: one(categories, { fields: [videos.categoryId], references: [categories.id] }),
    views: many(videoViews),
    reactions: many(videoReactions),
    comments: many(comments),
    playlistVideos: many(playlistVideos),
}));
// comments
export const comments = pgTable(
    'comments',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        parentId: uuid('parent_id'),
        userId: uuid('user_id')
            .references(() => users.id, { onDelete: 'cascade' })
            .notNull(),
        videoId: uuid('video_id')
            .references(() => videos.id, { onDelete: 'cascade' })
            .notNull(),
        value: text('value').notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (t) => {
        return [
            foreignKey({
                columns: [t.parentId],
                foreignColumns: [t.id],
                name: 'comments_parentId_fkey',
            }).onDelete('cascade'),
        ];
    },
);

export const commentRelations = relations(comments, ({ one, many }) => ({
    user: one(users, { fields: [comments.userId], references: [users.id] }),
    video: one(videos, { fields: [comments.videoId], references: [videos.id] }),
    parent: one(comments, { fields: [comments.parentId], references: [comments.id], relationName: 'comments_parentId_fkey' }),
    reactions: many(commentReactions),
    replies: many(comments, {
        relationName: 'comments_parentId_fkey',
    }),
}));

export const commentSelectSchema = createSelectSchema(comments);
export const commentUpdateSchema = createUpdateSchema(comments);
export const commentInsertSchema = createInsertSchema(comments);

// comment reactions

export const commentReactions = pgTable(
    'comment_reactions',
    {
        userId: uuid('user_id')
            .references(() => users.id, { onDelete: 'cascade' })
            .notNull(),
        commentId: uuid('comment_id')
            .references(() => comments.id, { onDelete: 'cascade' })
            .notNull(),
        type: reactionType('type').notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (t) => [
        primaryKey({
            name: 'comment_reactions_pkey',
            columns: [t.userId, t.commentId],
        }),
    ],
);

export const commentReactionRelations = relations(commentReactions, ({ one }) => ({
    user: one(users, {
        fields: [commentReactions.userId],
        references: [users.id],
    }),
    comment: one(comments, {
        fields: [commentReactions.commentId],
        references: [comments.id],
    }),
}));

// video views
export const videoViews = pgTable(
    'video_views',
    {
        userId: uuid('user_id')
            .references(() => users.id, { onDelete: 'cascade' })
            .notNull(),
        videoId: uuid('video_id')
            .references(() => videos.id, { onDelete: 'cascade' })
            .notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (t) => [
        primaryKey({
            name: 'video_views_pkey',
            columns: [t.userId, t.videoId],
        }),
    ],
);

export const videoViewRelations = relations(videoViews, ({ one }) => ({
    user: one(users, {
        fields: [videoViews.userId],
        references: [users.id],
    }),
    video: one(videos, {
        fields: [videoViews.videoId],
        references: [videos.id],
    }),
}));

export const videoViewSelectSchema = createSelectSchema(videoViews);
export const videoViewUpdateSchema = createUpdateSchema(videoViews);
export const videoViewInsertSchema = createInsertSchema(videoViews);

// video reactions

export const videoReactions = pgTable(
    'video_reactions',
    {
        userId: uuid('user_id')
            .references(() => users.id, { onDelete: 'cascade' })
            .notNull(),
        videoId: uuid('video_id')
            .references(() => videos.id, { onDelete: 'cascade' })
            .notNull(),
        type: reactionType('type').notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (t) => [
        primaryKey({
            name: 'video_reactions_pkey',
            columns: [t.userId, t.videoId],
        }),
    ],
);
export const videoReactionRelation = relations(videoReactions, ({ one }) => ({
    user: one(users, {
        fields: [videoReactions.userId],
        references: [users.id],
    }),
    video: one(videos, {
        fields: [videoReactions.videoId],
        references: [videos.id],
    }),
}));

export const videoReactionSelectSchema = createSelectSchema(videoReactions);
export const videoReactionUpdateSchema = createUpdateSchema(videoReactions);
export const videoReactionInsertSchema = createInsertSchema(videoReactions);
