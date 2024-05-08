import { ILoginRequest, ILoginResponse } from '@/models/auth';
import { ILicenseResponse } from '@/models/license';
import axios from 'axios';

const serverUrl = 'http://localhost:8080/api';

export const login = (apiArgs: ILoginRequest) =>
  axios.post<ILoginResponse>(`${serverUrl}/auth/login`, apiArgs);

// export const logout = () =>
//   http.post<{}, {}>(`${serverUrl}/auth/logout`, { credentials: 'include' });

export const userInfo = () =>
  axios.get(`${serverUrl}/user/info`, {
    headers: {
      Authorization: 'bearer ' + localStorage.getItem('posxAccessToken'),
    },
  });

export const getActiveLicenses = () =>
  axios.get<{ license: ILicenseResponse; valid: boolean }[]>(
    `${serverUrl}/license`,
  );

export const validateLicense = (apiArgs: { number: string }) =>
  axios.post<{ license: ILicenseResponse; valid: boolean }>(
    `${serverUrl}/license/validate`,
    apiArgs,
  );
