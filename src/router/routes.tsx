import { lazy } from 'react';
const Index = lazy(() => import('../pages/Index'));


const User = lazy(() => import('../pages/Apps/User'));
const Remboursement = lazy(() => import('../pages/Apps/Remboursement'));
const Pret = lazy(() => import('../pages/Apps/Pret'));

const ERROR404 = lazy(() => import('../pages/Pages/Error404'));
const ERROR500 = lazy(() => import('../pages/Pages/Error500'));
const ERROR503 = lazy(() => import('../pages/Pages/Error503'));
const LoginBoxed = lazy(() => import('../pages/Authentication/LoginBoxed'));

const Error = lazy(() => import('../components/Error'));


const routes = [
    // dashboard
    {
        path: '/',
        // element: <Index />,
        element: <LoginBoxed />,
    },
 
   {
        path: '/apps/pret',
        element: <Pret/>,
    },
    {
        path: '/apps/remboursement',
        element: <Remboursement/>,
    },
  
    {
        path: '/apps/client',
        element: <User/>,
    },
 
  
    {
        path: '/pages/error404',
        element: <ERROR404 />,
        layout: 'blank',
    },
    {
        path: '/pages/error500',
        element: <ERROR500 />,
        layout: 'blank',
    },
    {
        path: '/pages/error503',
        element: <ERROR503 />,
        layout: 'blank',
    },
 
    //Authentication
    {
        path: '/auth/boxed-signin',
        element: <LoginBoxed />,
        layout: 'blank',
    },
   
 
    //forms page
   
  
    {
        path: '*',
        element: <Error />,
        layout: 'blank',
    },
];

export { routes };
