import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { Dashboard } from './views/Dashboard.tsx';
import { InboundPage } from './views/InboundPage.tsx';
import { SettingsPage } from './views/SettingsPage.tsx';
import { LoginPage } from './views/LoginPage.tsx';
import { NotFound } from './views/NotFound.tsx';
import App from './App.tsx';

const rootRoute = createRootRoute({
    component: App,
    notFoundComponent: NotFound,
});

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Dashboard });
const inboundsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/inbounds', component: InboundPage });
const settingsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings', component: SettingsPage });
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: LoginPage });

const routeTree = rootRoute.addChildren([indexRoute, inboundsRoute, settingsRoute, loginRoute]);

declare global {
    interface Window {
        __WEB_ROOT__?: string;
    }
}

const getAutoDetectedRoot = () => {
    if (window.__WEB_ROOT__ && window.__WEB_ROOT__ !== "{{WEB_ROOT}}") {
        let root = window.__WEB_ROOT__;
        if (!root.startsWith('/')) root = '/' + root;
        return root.endsWith('/') && root.length > 1 ? root.slice(0, -1) : root;
    }

    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);

    const topRoutes = ['login', 'inbounds', 'settings', 'dashboard'];

    if (segments.length > 0 && !topRoutes.includes(segments[0])) {
        return '/' + segments[0];
    }

    return '';
};

const basepath = getAutoDetectedRoot();

export const router = createRouter({
    routeTree,
    basepath: basepath || '/',
    defaultNotFoundComponent: NotFound,
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}