import type { NextApiRequest, NextApiResponse } from 'next';
import { Db } from 'mongodb';
import RouteHandler from 'next-connect';

import Message from '../../models/message';
import MongoService from '../../services/mongo';

export default RouteHandler<NextApiRequest, NextApiResponse>()
    .post(async (request, response) => {
        let message = await Message.create(request.body.payload, request.body.password);

        if ( ! message) {
            return response.json({
                success: false,
                error: 'Unable to create message.',
            });
        }

        return response.json({
            success: true,
            message: {
                slug: message.slug,
            },
        });
    });
