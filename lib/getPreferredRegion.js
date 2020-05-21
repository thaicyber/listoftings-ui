import Cookies from 'universal-cookie';
import { DEFAULT_REGION } from '../constants/regions';

/*
@param req {Object} Express Request, available if server rendered, otherwise use the browser cookie
*/

export default function getPreferredRegion(req) {
  if (req && req.cookies) {
    return (req.cookies.preferredRegion || DEFAULT_REGION);
  }

  const cookies = new Cookies();
  if (!cookies.get('preferredRegion')) {
    cookies.set('preferredRegion', DEFAULT_REGION, { path: '/' });
  }
  return cookies.get('preferredRegion');
}
