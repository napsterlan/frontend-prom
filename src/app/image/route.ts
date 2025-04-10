import { NextRequest, NextResponse } from 'next/server';
import * as querystring from "node:querystring";
import * as https from "node:https";

const YANDEX_CAPTCHA_SECRET = process.env.YANDEX_CAPTCHA_SECRET_KEY!;

export async function GET(request: NextRequest) {
    try {
        const { token } = await request.json();
        console.log(token);
        return NextResponse.json({ passed: false });
    } catch (error) {
        console.error('Error validating captcha:', error);
        return NextResponse.json({ passed: false });
    }
}