"use client";

import { useState } from 'react';
import Cookies from 'js-cookie';

export function useAuth() {
  const [isAuthenticated] = useState<boolean | null>(() => {
    const token = Cookies.get('access_token');
    return !!token;
  });
 
  return isAuthenticated;
}