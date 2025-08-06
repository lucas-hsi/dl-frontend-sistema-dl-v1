import { NextPageContext } from 'next';
import { ErrorProps } from 'next/error';

interface CustomErrorProps extends ErrorProps {
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

function Error({ statusCode, hasGetInitialPropsRun, err }: CustomErrorProps) {
  if (!hasGetInitialPropsRun && err) {
    // getInitialProps is not called in case of
    // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
    // err via _app.js so it can be captured
    // eslint-disable-next-line no-unused-vars
    console.error('Error page has not been properly statically optimized', err);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">
          {statusCode || 'Erro'}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {statusCode
            ? `Ocorreu um erro ${statusCode} no servidor`
            : 'Ocorreu um erro no cliente'}
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Voltar ao Início
        </button>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const errorInitialProps: { hasGetInitialPropsRun: boolean; statusCode?: number } = { hasGetInitialPropsRun: true };

  // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
  // getInitialProps has run
  errorInitialProps.hasGetInitialPropsRun = true;

  // Running on the server, the response object (`res`) is available.
  //
  // Next.js will pass an err on the server if a page's `getInitialProps`
  // threw or returned a Promise that rejected
  //
  // Running on the client (browser), Next.js will provide an err if:
  //
  //  - a page's `getInitialProps` threw or returned a Promise that rejected
  //  - an exception was thrown somewhere in the React lifecycle (render,
  //    componentDidMount, etc) that was caught by Next.js's React Error
  //    Boundary. Read more about what types of exceptions are caught by Error
  //    Boundaries: https://reactjs.org/docs/error-boundaries.html

  if (res) {
    // Running on the server. `res` is available.
    //
    // Next.js will pass an err on the server if a page's `getInitialProps`
    // threw or returned a Promise that rejected
    if (res.statusCode === 404) {
      // Opinionated: do not record an error in Sentry for 404
      // https://github.com/vercel/next.js/pull/2473
      return { statusCode: 404 };
    }

    if (err) {
      errorInitialProps.statusCode = res.statusCode;
      return errorInitialProps;
    }
  }

  // Running on the client (browser).
  //
  // Next.js will provide an err if:
  //
  //  - a page's `getInitialProps` threw or returned a Promise that rejected
  //  - an exception was thrown somewhere in the React lifecycle (render,
  //    componentDidMount, etc) that was caught by Next.js's React Error
  //    Boundary. Read more about what types of exceptions are caught by Error
  //    Boundaries: https://reactjs.org/docs/error-boundaries.html

  if (err) {
    errorInitialProps.statusCode = err.statusCode;
    return errorInitialProps;
  }

  // This should not be reached!! (when getInitialProps has not run)
  //
  // You are seeing this error as you're using `next export` or a custom
  // `next.config.js` that exports it as a static page, which has the following
  // error:
  //
  //   Error: No router instance found. You should only use "next/router"
  //   inside the client side of your app.
  //
  // To fix this, you can:
  //
  //  - Remove `next export` and use `next build && next start`
  //  - Or, you can add this to `next.config.js`:
  //
  //      module.exports = {
  //        trailingSlash: true,
  //      }
  //
  //  - Or, you can use `next.config.js` like this:
  //
  //      module.exports = {
  //        exportPathMap: function () {
  //          return {
  //            '/': { page: '/' },
  //          }
  //        },
  //      }
  //
  //  - Or, you can remove the usage of `next/router` from your page. You
  //    should only use `next/router` inside the client side of your app.
  //
  //  - Or, you can use `next/router` with the following configuration:
  //
  //      module.exports = {
  //        webpack: (config, { isServer }) => {
  //          if (!isServer) {
  //            config.resolve.fallback = {
  //              ...config.resolve.fallback,
  //              fs: false,
  //            };
  //          }
  //          return config;
  //        },
  //      }
  //
  //  - Or, you can use `next/router` with the following configuration:
  //
  //      module.exports = {
  //        webpack: (config, { isServer }) => {
  //          if (!isServer) {
  //            config.resolve.fallback = {
  //              ...config.resolve.fallback,
  //              fs: false,
  //            };
  //          }
  //          return config;
  //        },
  //      }

  console.error(
    'Error.getInitialProps called without an error, this is unexpected and may indicate a bug in Next.js'
  );

  return errorInitialProps;
};

export default Error; 