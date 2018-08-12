import { Layout } from './layout/layout';
import { Pagination } from './pagination/pagination';
import { User } from './user/user';
import { UserList } from './user-list/user-list';
import { UserService } from './user-service';

import './index.css';

const userService = new UserService('https://livedemo.xsolla.com/fe/test-task/baev/users');

customElements.define('ta-layout', Layout);

customElements.define('ta-pagination', Pagination);

customElements.define('ta-user', User);

UserList.userService = userService;
customElements.define('ta-user-list', UserList);