import type { AspidaClient, BasicHeaders } from 'aspida';
import type { Methods as Methods_1l4ne2h } from './directory';
import type { Methods as Methods_3l1j5o } from './file';
import type { Methods as Methods_49ci28 } from './file/_id@string';
import type { Methods as Methods_18qsrps } from './health';
import type { Methods as Methods_tli9od } from './user';
import type { Methods as Methods_1904ovn } from './user/login';
import type { Methods as Methods_1y88zj4 } from './user/logout';

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? 'http://localhost:8080' : baseURL).replace(/\/$/, '');
  const PATH0 = '/directory';
  const PATH1 = '/file';
  const PATH2 = '/health';
  const PATH3 = '/user';
  const PATH4 = '/user/login';
  const PATH5 = '/user/logout';
  const GET = 'GET';
  const POST = 'POST';
  const PUT = 'PUT';
  const DELETE = 'DELETE';

  return {
    directory: {
      /**
       * ディレクトリ作成
       * @returns ディレクトリ作成成功
       */
      post: (option: { body: Methods_1l4ne2h['post']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_1l4ne2h['post']['resBody'], BasicHeaders, Methods_1l4ne2h['post']['status']>(prefix, PATH0, POST, option).json(),
      /**
       * ディレクトリ作成
       * @returns ディレクトリ作成成功
       */
      $post: (option: { body: Methods_1l4ne2h['post']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_1l4ne2h['post']['resBody'], BasicHeaders, Methods_1l4ne2h['post']['status']>(prefix, PATH0, POST, option).json().then(r => r.body),
      $path: () => `${prefix}${PATH0}`,
    },
    file: {
      _id: (val1: string) => {
        const prefix1 = `${PATH1}/${val1}`;

        return {
          /**
           * ファイル単体取得
           * @returns ファイル単体取得成功
           */
          get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods_49ci28['get']['resBody'], BasicHeaders, Methods_49ci28['get']['status']>(prefix, prefix1, GET, option).json(),
          /**
           * ファイル単体取得
           * @returns ファイル単体取得成功
           */
          $get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods_49ci28['get']['resBody'], BasicHeaders, Methods_49ci28['get']['status']>(prefix, prefix1, GET, option).json().then(r => r.body),
          $path: () => `${prefix}${prefix1}`,
        };
      },
      /**
       * ファイル一覧取得
       * @returns ファイル一覧取得
       */
      get: (option: { body: Methods_3l1j5o['get']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_3l1j5o['get']['resBody'], BasicHeaders, Methods_3l1j5o['get']['status']>(prefix, PATH1, GET, option).json(),
      /**
       * ファイル一覧取得
       * @returns ファイル一覧取得
       */
      $get: (option: { body: Methods_3l1j5o['get']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_3l1j5o['get']['resBody'], BasicHeaders, Methods_3l1j5o['get']['status']>(prefix, PATH1, GET, option).json().then(r => r.body),
      /**
       * ファイルアップロード
       * @returns ファイルアップロード成功
       */
      post: (option: { body: Methods_3l1j5o['post']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_3l1j5o['post']['resBody'], BasicHeaders, Methods_3l1j5o['post']['status']>(prefix, PATH1, POST, option).json(),
      /**
       * ファイルアップロード
       * @returns ファイルアップロード成功
       */
      $post: (option: { body: Methods_3l1j5o['post']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_3l1j5o['post']['resBody'], BasicHeaders, Methods_3l1j5o['post']['status']>(prefix, PATH1, POST, option).json().then(r => r.body),
      /**
       * ファイル更新
       * @returns ファイル更新成功
       */
      put: (option: { body: Methods_3l1j5o['put']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_3l1j5o['put']['resBody'], BasicHeaders, Methods_3l1j5o['put']['status']>(prefix, PATH1, PUT, option).json(),
      /**
       * ファイル更新
       * @returns ファイル更新成功
       */
      $put: (option: { body: Methods_3l1j5o['put']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_3l1j5o['put']['resBody'], BasicHeaders, Methods_3l1j5o['put']['status']>(prefix, PATH1, PUT, option).json().then(r => r.body),
      /**
       * ファイル削除
       */
      delete: (option: { body: Methods_3l1j5o['delete']['reqBody'], config?: T | undefined }) =>
        fetch(prefix, PATH1, DELETE, option).send(),
      /**
       * ファイル削除
       */
      $delete: (option: { body: Methods_3l1j5o['delete']['reqBody'], config?: T | undefined }) =>
        fetch(prefix, PATH1, DELETE, option).send().then(r => r.body),
      $path: () => `${prefix}${PATH1}`,
    },
    health: {
      /**
       * 動作確認用
       * @returns OK
       */
      get: (option?: { config?: T | undefined } | undefined) =>
        fetch<Methods_18qsrps['get']['resBody'], BasicHeaders, Methods_18qsrps['get']['status']>(prefix, PATH2, GET, option).json(),
      /**
       * 動作確認用
       * @returns OK
       */
      $get: (option?: { config?: T | undefined } | undefined) =>
        fetch<Methods_18qsrps['get']['resBody'], BasicHeaders, Methods_18qsrps['get']['status']>(prefix, PATH2, GET, option).json().then(r => r.body),
      $path: () => `${prefix}${PATH2}`,
    },
    user: {
      login: {
        /**
         * ログイン
         * @returns ログイン成功
         */
        post: (option: { body: Methods_1904ovn['post']['reqBody'], config?: T | undefined }) =>
          fetch<Methods_1904ovn['post']['resBody'], BasicHeaders, Methods_1904ovn['post']['status']>(prefix, PATH4, POST, option).json(),
        /**
         * ログイン
         * @returns ログイン成功
         */
        $post: (option: { body: Methods_1904ovn['post']['reqBody'], config?: T | undefined }) =>
          fetch<Methods_1904ovn['post']['resBody'], BasicHeaders, Methods_1904ovn['post']['status']>(prefix, PATH4, POST, option).json().then(r => r.body),
        $path: () => `${prefix}${PATH4}`,
      },
      logout: {
        /**
         * ログアウト
         * @returns ログアウト成功
         */
        post: (option?: { config?: T | undefined } | undefined) =>
          fetch<Methods_1y88zj4['post']['resBody'], BasicHeaders, Methods_1y88zj4['post']['status']>(prefix, PATH5, POST, option).json(),
        /**
         * ログアウト
         * @returns ログアウト成功
         */
        $post: (option?: { config?: T | undefined } | undefined) =>
          fetch<Methods_1y88zj4['post']['resBody'], BasicHeaders, Methods_1y88zj4['post']['status']>(prefix, PATH5, POST, option).json().then(r => r.body),
        $path: () => `${prefix}${PATH5}`,
      },
      /**
       * ユーザー作成
       * @returns ユーザー作成成功
       */
      post: (option: { body: Methods_tli9od['post']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_tli9od['post']['resBody'], BasicHeaders, Methods_tli9od['post']['status']>(prefix, PATH3, POST, option).json(),
      /**
       * ユーザー作成
       * @returns ユーザー作成成功
       */
      $post: (option: { body: Methods_tli9od['post']['reqBody'], config?: T | undefined }) =>
        fetch<Methods_tli9od['post']['resBody'], BasicHeaders, Methods_tli9od['post']['status']>(prefix, PATH3, POST, option).json().then(r => r.body),
      $path: () => `${prefix}${PATH3}`,
    },
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;
