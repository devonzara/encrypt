import type { NextApiRequest, NextApiResponse } from 'next';
import RouteHandler from 'next-connect';

import Message from '../../../models/message';

export default RouteHandler<NextApiRequest, NextApiResponse>()
    .post(async (request, response) => {
        const slug = request.query.slug.toString();
        const password = request.body.password;
        const message = await Message.findOne({ slug, password });

        if ( ! message) {
            return response.json({
                success: false,
                error: 'Unable to verify password.',
            });
        }

        const { deletedCount } = await Message.removeOne({ slug, password });
        if ( ! deletedCount) {
            // eslint-disable-next-line no-console
            console.error(`[ERROR] api/message/${slug}/verify: Unable to delete document.`);
        }

        return response.json({
            success: true,
            data: {
                verified: true,
                payload: message.payload,
            },
        });
    });
