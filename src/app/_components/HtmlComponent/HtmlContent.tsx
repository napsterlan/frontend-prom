"use client"

import DOMPurify from 'isomorphic-dompurify';
import styles from './HtmlContent.module.css'; // We'll create this next

interface HtmlContentProps {
    html: string;
    className?: string;
}

const BootstrapWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="bootstrap-wrapper w-[100%] text-[14px]">
            {children}
            <style jsx global>{`
        .bootstrap-wrapper {
          /* Scope Bootstrap styles to this wrapper */
          --bs-gutter-x: 1.5rem;
          --bs-gutter-y: 0;
        }
        
        
        /* Only apply Bootstrap styles within the wrapper */
        .bootstrap-wrapper table {
          width: 100%;
          margin-bottom: 1rem;
          border-collapse: collapse;
        }
        
        .bootstrap-header p {
            color: #212529;
            display: inline-block;
            font-size: 30px;
            line-height: 1;
            margin: 0;
            padding: 0;
            font-weight: 700;
            position: relative;
            top: 1px;
            letter-spacing: -.05em;
            -webkit-font-smoothing: antialiased;
        }
        
        .bootstrap-wrapper td,
        .bootstrap-wrapper th {
          padding: 0.75rem;
          border-top: 1px solid #dee2e6;
        }

        .img-responsive {
            display: block;
            max-width: 100%;
            height: auto;
        }
        .bootstrap-wrapper img {
            vertical-align: middle;
            margin: auto;
            border-radius: 16px;
        }

        .bootstrap-wrapper ul {
            font-size: 14px;
            margin-top: 0;
            margin-bottom: 10px;
            list-style: disc !important;
            margin-block-start: 1em;
            margin-block-end: 1em;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
            padding-inline-start: 40px;
            unicode-bidi: isolate;
        }
        
        .bootstrap-wrapper a {
            text-decoration: underline;
            text-decoration-color: #5cd69c;
            text-decoration-thickness: 3px;
            text-underline-position: under;
        }
        .bootstrap-wrapper blockquote {
            padding: 10px 20px;
            margin: 0 0 20px;
            font-size: 17.5px;
            border-left: 5px solid #eee;
        }
        .bootstrap-wrapper blockquote ol:last-child, .bootstrap-wrapper blockquote p:last-child,  .bootstrap-wrapper blockquote ul:last-child {
            margin-bottom: 0;
        }


        .col-xs-12 {
            width: 100%;
        }
        .col-xs-1, .col-xs-10, .col-xs-11, .col-xs-12, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9 {
            float: left;
        }
        .col-lg-1, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-xs-1, .col-xs-10, .col-xs-11, .col-xs-12, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9 {
            position: relative;
            min-height: 1px;
            padding-right: 15px;
            padding-left: 15px;
        }

        @media (min-width: 768px) {
            .col-sm-6 {
                width: 50%;
            }
        }
        @media (min-width: 768px) {
            .col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9 {
                float: left;
            }
        }

        @media (min-width: 768px) {
            .col-sm-12 {
                width: 100%;
            }
        }
        p {
            font-size: 14px;
            margin: 0 0 10px;
        }
        .btn-primary {
            color: #fff;
            background-color: #337ab7;
            border-color: #2e6da4;
        }

        .btn-primary {
            height: 40px;
            border-radius: 20px !important;
            border: 2px solid;
            background-color: #2C364C;
            border-color: #2C364C;
            color: #FFF;
        }

        .btn {
            display: inline-block;
            padding: 6px 12px;
            margin-bottom: 0;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.42857143;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            background-image: none;
            border: 1px solid transparent;
            border-radius: 4px;
            text-decoration: none !important;
      `}
            </style>
        </div>
    );
};


export const HtmlContent: React.FC<HtmlContentProps> = ({ html, className = '' }) => {
    // First decode HTML entities
    const decodedHtml = html.replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')
        // .replace(/img/g, 'Image');
    const transformedHtml = decodedHtml.replace(
        /(src=["'])(\/image)(\/catalog\/.*?)(["'])/g,
        (match, p1, imagePrefix, p2, p3) => {
            const apiUrl = process.env.NEXT_PUBLIC_MINIO_URL || 'http://192.168.31.40:9015/promled-website-test/';
            // Remove '/image' and just use the catalog path
            return `${p1}${apiUrl}${p2}${p3}`;
        }
    ).replace(
        /(src=["'])(image)(\/catalog\/.*?)(["'])/g,
        (match, p1, imagePrefix, p2, p3) => {
            const apiUrl = process.env.NEXT_PUBLIC_MINIO_URL || 'http://192.168.31.40:9015/promled-website-test/';
            // Remove '/image' and just use the catalog path
            return `${p1}${apiUrl}${p2}${p3}`;
        }
    );

    // Sanitize the HTML to prevent XSS attacks
    const sanitizedHtml = DOMPurify.sanitize(transformedHtml);

    return (
            <BootstrapWrapper>

            <div
                data-bootstrap-content="true"
                className={`bootstrap-content ${className}`}
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
            </BootstrapWrapper>

    );
}