
import { createProcess } from '@dojo/framework/stores/process';
import { remove, replace } from '@dojo/framework/stores/state/operations';
import { getHeaders, commandFactory } from './utils';
import { baseUrl } from '../config';
import {
    SlugPayload,
    FavoriteArticlePayload,
    FollowUserPayload,
    AddCommentPayload,
    DeleteCommentPayload,
    NewCommentPayload
} from './interfaces';

const startLoadingPersonCommand = commandFactory(({ path }) => {
    return [
        replace(path('person', 'item'), undefined),
        replace(path('person', 'comments'), []),
        replace(path('person', 'loading'), true),
        replace(path('person', 'loaded'), false)
    ];
});

const loadPersonCommand = commandFactory<ItemIdPayload>(async ({ get, path, payload: { slug } }) => {
    const token = get(path('user', 'token'));
    const response = await fetch(`${baseUrl}/persons/${itemId}`, {
        headers: getHeaders(token)
    });
    const json = await response.json();

    return [
        replace(path('person', 'item'), json.person),
        replace(path('person', 'loading'), false),
        replace(path('person', 'loaded'), true)
    ];
});


const loadRelationsCommand = commandFactory<ItemIdPayload>(async ({ get, path, payload: { slug } }) => {
    const token = get(path('user', 'token'));
    const response = await fetch(`${baseUrl}/articles/${slug}/comments`, {
        headers: getHeaders(token)
    });
    const json = await response.json();

    return [replace(path('article', 'comments'), json.comments)];
});

const addRelationCommand = commandFactory<AddCommentPayload>(
    async ({ at, get, path, payload: { slug, newComment } }) => {
        const token = get(path('user', 'token'));
        const requestPayload = {
            comment: {
                body: newComment
            }
        };
        const response = await fetch(`${baseUrl}/articles/${slug}/comments`, {
            method: 'post',
            headers: getHeaders(token),
            body: JSON.stringify(requestPayload)
        });
        const json = await response.json();
        const comments = get(path('article', 'comments'));

        return [
            replace(at(path('article', 'comments'), comments.length), json.comment),
            replace(path('article', 'newComment'), '')
        ];
    }
);

const deleteRelationCommand = commandFactory<DeleteCommentPayload>(async ({ at, get, path, payload: { slug, id } }) => {
    const token = get(path('user', 'token'));
    await fetch(`${baseUrl}/articles/${slug}/comments/${id}`, {
        method: 'delete',
        headers: getHeaders(token)
    });
    const comments = get(path('article', 'comments'));
    let index = -1;
    for (let i = 0; i < comments.length; i++) {
        if (comments[i].id === id) {
            index = i;
            break;
        }
    }

    if (index !== -1) {
        return [remove(at(path('article', 'comments'), index))];
    }
    return [];
});

const newCommentInputCommand = commandFactory<NewCommentPayload>(({ path, payload: { newComment } }) => {
    return [replace(path('article', 'newComment'), newComment)];
});

const deleteArticleCommand = commandFactory<SlugPayload>(async ({ get, path, payload: { slug } }) => {
    const token = get(path('user', 'token'));
    await fetch(`${baseUrl}/articles/${slug}`, {
        method: 'delete',
        headers: getHeaders(token)
    });
    return [];
});

export const getArticleProcess = createProcess('get-article', [
    startLoadingArticleCommand,
    [loadArticleCommand, loadCommentsCommand]
]);
export const deleteCommentProcess = createProcess('delete-comment', [deleteCommentCommand]);
export const addCommentProcess = createProcess('add-comment', [addCommentCommand]);
export const newCommentInputProcess = createProcess('new-comment-input', [newCommentInputCommand]);
export const favoriteArticleProcess = createProcess('fav-article', [favoriteArticleCommand]);
export const followUserProcess = createProcess('follow-user', [followUserCommand]);
export const deleteArticleProcess = createProcess('delete-article', [deleteArticleCommand]);
