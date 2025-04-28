
import { HomePage } from '/views/home';
import AboutPage from '/views/about';
import FormPage from '/views/form';

import LeftPage1 from '/views/left-page-1';
import LeftPage2 from '/views/left-page-2';
import DynamicRoutePage from '/views/dynamic-route';
import RequestAndLoad from '/views/request-and-load';
import NotFoundPage from '/views/404';


export const checkAuthorization = () => {

  const authData = localStorage.getItem("Authorization")

  if (!authData) {
    return false
  }

  const { token, lastAcess, expireIn } = JSON.parse(authData);

  if (!token || !lastAcess || !expireIn) {
    return false
  }

  const expirationTime = Number(lastAcess) + Number(expireIn) * 60 * 1000

  if (Date.now() >= expirationTime) {
    return false
  } else {
    return true
  }

}

const PrivateRoute = ({ component }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {

    let animationFrameId

    const checkAuth = () => {

      const isAuth = checkAuthorization()

      if (!isAuth) {
        setIsAuthenticated(false)
      } else {
        setIsAuthenticated(true)
        animationFrameId = requestAnimationFrame(checkAuth)
      }
    }

    checkAuth()

    return () => cancelAnimationFrame(animationFrameId)

  }, [])

  if (isAuthenticated === null) {
    return null
  }

  const redirect = window.location.pathname == '/' ? '' : `?redirect=${window.location.pathname}`

  //return isAuthenticated ? component : <Navigation to={`/sign-in${redirect}`} replace />

  return component

}


var routes = [
  {
    path: '/',
    component: <PrivateRoute><HomePage /></PrivateRoute>,
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/form/',
    component: FormPage,
  },

  {
    path: '/left-page-1/',
    component: LeftPage1,
  },
  {
    path: '/left-page-2/',
    component: LeftPage2,
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = to.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad,
          },
          {
            props: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
