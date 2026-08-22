interface Window {
  Telegram?: {
    WebApp: {
      ready: () => void;
      expand: () => void;
      close: () => void;
      setHeaderColor: (color: string) => void;
      setBackgroundColor: (color: string) => void;
      initData: string;
      initDataUnsafe: {
        query_id?: string;
        user?: {
          id: number;
          first_name: string;
          last_name?: string;
          username?: string;
          language_code?: string;
          photo_url?: string;
        };
        auth_date?: number;
        hash?: string;
      };
      colorScheme: 'light' | 'dark';
      openInvoice: (url: string, callback?: (status: string) => void) => void;
      MainButton: {
        text: string;
        color: string;
        textColor: string;
        isVisible: boolean;
        isActive: boolean;
        isProgressVisible: boolean;
        setText: (text: string) => void;
        onClick: (callback: () => void) => void;
        offClick: (callback: () => void) => void;
        show: () => void;
        hide: () => void;
        enable: () => void;
        disable: () => void;
        showProgress: (leaveActive?: boolean) => void;
        hideProgress: () => void;
        setParams: (params: any) => void;
      };
    };
  };
}
