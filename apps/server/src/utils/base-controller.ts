import HttpStatus from 'http-status';
import { Response } from 'express';

class BaseController {
    sendError({
        error,
        res,
        status = HttpStatus.INTERNAL_SERVER_ERROR,
    }: {
        error: any;
        res: Response;
        status?: number;
    }) {
        if (res.writableEnded || res.writableFinished || res.headersSent) {
            return res.writableEnded || res.writableFinished || res.headersSent;
        }

        status = error?.status || status;

        if (process.env.NODE_ENV === 'production') {
            return res.status(status).json({
                code: '500',
                message: 'Something went wrong, please try again.',
                status: 'error',
            });
        }

        return res.status(status).json({
            code: error?.code || '500',
            message: error?.message || 'Something went wrong, please try again.',
            status: 'error',
        });
    }

    sendSuccess({ data, res, status = HttpStatus.OK }: { data: any; res: Response; status?: number }) {
        if (res.writableEnded || res.writableFinished || res.headersSent) {
            return res.writableEnded || res.writableFinished || res.headersSent;
        }

        return res.status(status).json({
            data,
            status: 'success',
        });
    }
}

export default BaseController;
