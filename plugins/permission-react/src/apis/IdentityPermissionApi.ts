/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { PermissionApi } from './PermissionApi';
import {
  AuthorizeRequest,
  AuthorizeResponse,
  PermissionClient,
} from '@backstage/plugin-permission-common';
import { Config } from '@backstage/config';

/**
 * The default implementation of the PermissionApi, which simply calls the authorize method of the given
 * {@link @backstage/plugin-permission-common#PermissionClient}.
 * @public
 */
export class IdentityPermissionApi implements PermissionApi {
  private constructor(
    private readonly permissionClient: PermissionClient,
    private readonly identityApi: IdentityApi,
  ) {}

  static create(options: {
    config: Config;
    discovery: DiscoveryApi;
    identity: IdentityApi;
  }) {
    const { config, discovery, identity } = options;
    const permissionClient = new PermissionClient({ discovery, config });
    return new IdentityPermissionApi(permissionClient, identity);
  }

  async authorize(request: AuthorizeRequest): Promise<AuthorizeResponse> {
    const response = await this.permissionClient.authorize([request], {
      token: await this.identityApi.getIdToken(),
    });
    return response[0];
  }
}
