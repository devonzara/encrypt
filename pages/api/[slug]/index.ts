import type { NextApiRequest, NextApiResponse } from 'next';
import RouteHandler from 'next-connect';

import Message from '../../../models/message';

type ResponseBody = {
    success: boolean,
    data: {
        exists: boolean,
        slug?: string,
    },
};

export default RouteHandler<NextApiRequest, NextApiResponse>()
    .get(async (request, response) => {
        Message.removeExpiredMessages();

        const slug = request.query.slug.toString();
        const message = (await Message.findBySlug(slug)) as Message;

        const responseBody: ResponseBody = {
            success: true,
            data: {
                exists: !! message,
            },
        };

        if (message) responseBody.data.slug = message.slug;
        return response.json(responseBody);
    });

