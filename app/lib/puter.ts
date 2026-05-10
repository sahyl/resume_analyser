// import { create } from "zustand";

// declare global {
//   interface Window {
//     puter: {
//       auth: {
//         getUser: () => Promise<PuterUser>;
//         isSignedIn: () => Promise<boolean>;
//         signIn: () => Promise<void>;
//         signOut: () => Promise<void>;
//       };
//       fs: {
//         write: (
//           path: string,
//           data: string | File | Blob
//         ) => Promise<File | undefined>;
//         read: (path: string) => Promise<Blob>;
//         upload: (file: File[] | Blob[]) => Promise<FSItem>;
//         delete: (path: string) => Promise<void>;
//         readdir: (path: string) => Promise<FSItem[] | undefined>;
//       };
//       ai: {
//         chat: (
//           prompt: string | ChatMessage[],
//           imageURL?: string | PuterChatOptions,
//           testMode?: boolean,
//           options?: PuterChatOptions
//         ) => Promise<Object>;
//         img2txt: (
//           image: string | File | Blob,
//           testMode?: boolean
//         ) => Promise<string>;
//       };
//       kv: {
//         get: (key: string) => Promise<string | null>;
//         set: (key: string, value: string) => Promise<boolean>;
//         delete: (key: string) => Promise<boolean>;
//         list: (pattern: string, returnValues?: boolean) => Promise<string[]>;
//         flush: () => Promise<boolean>;
//       };
//     };
//   }
// }

// interface PuterStore {
//   isLoading: boolean;
//   error: string | null;
//   puterReady: boolean;
//   auth: {
//     user: PuterUser | null;
//     isAuthenticated: boolean;
//     signIn: () => Promise<void>;
//     signOut: () => Promise<void>;
//     refreshUser: () => Promise<void>;
//     checkAuthStatus: () => Promise<boolean>;
//     getUser: () => PuterUser | null;
//   };
//   fs: {
//     write: (
//       path: string,
//       data: string | File | Blob
//     ) => Promise<File | undefined>;
//     read: (path: string) => Promise<Blob | undefined>;
//     upload: (file: File[] | Blob[]) => Promise<FSItem | undefined>;
//     delete: (path: string) => Promise<void>;
//     readDir: (path: string) => Promise<FSItem[] | undefined>;
//   };
//   ai: {
//     chat: (
//       prompt: string | ChatMessage[],
//       imageURL?: string | PuterChatOptions,
//       testMode?: boolean,
//       options?: PuterChatOptions
//     ) => Promise<AIResponse | undefined>;
//     feedback: (
//       path: string,
//       message: string
//     ) => Promise<AIResponse | undefined>;
//     img2txt: (
//       image: string | File | Blob,
//       testMode?: boolean
//     ) => Promise<string | undefined>;
//   };
//   kv: {
//     get: (key: string) => Promise<string | null | undefined>;
//     set: (key: string, value: string) => Promise<boolean | undefined>;
//     delete: (key: string) => Promise<boolean | undefined>;
//     list: (
//       pattern: string,
//       returnValues?: boolean
//     ) => Promise<string[] | KVItem[] | undefined>;
//     flush: () => Promise<boolean | undefined>;
//   };

//   init: () => void;
//   clearError: () => void;
// }

// const getPuter = (): typeof window.puter | null =>
//   typeof window !== "undefined" && window.puter ? window.puter : null;

// export const usePuterStore = create<PuterStore>((set, get) => {
//   const setError = (msg: string) => {
//     set({
//       error: msg,
//       isLoading: false,
//       auth: {
//         user: null,
//         isAuthenticated: false,
//         signIn: get().auth.signIn,
//         signOut: get().auth.signOut,
//         refreshUser: get().auth.refreshUser,
//         checkAuthStatus: get().auth.checkAuthStatus,
//         getUser: get().auth.getUser,
//       },
//     });
//   };

//   const checkAuthStatus = async (): Promise<boolean> => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return false;
//     }

//     set({ isLoading: true, error: null });

//     try {
//       const isSignedIn = await puter.auth.isSignedIn();
//       if (isSignedIn) {
//         const user = await puter.auth.getUser();
//         set({
//           auth: {
//             user,
//             isAuthenticated: true,
//             signIn: get().auth.signIn,
//             signOut: get().auth.signOut,
//             refreshUser: get().auth.refreshUser,
//             checkAuthStatus: get().auth.checkAuthStatus,
//             getUser: () => user,
//           },
//           isLoading: false,
//         });
//         return true;
//       } else {
//         set({
//           auth: {
//             user: null,
//             isAuthenticated: false,
//             signIn: get().auth.signIn,
//             signOut: get().auth.signOut,
//             refreshUser: get().auth.refreshUser,
//             checkAuthStatus: get().auth.checkAuthStatus,
//             getUser: () => null,
//           },
//           isLoading: false,
//         });
//         return false;
//       }
//     } catch (err) {
//       const msg =
//         err instanceof Error ? err.message : "Failed to check auth status";
//       setError(msg);
//       return false;
//     }
//   };

//   const signIn = async (): Promise<void> => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }

//     set({ isLoading: true, error: null });

//     try {
//       await puter.auth.signIn();
//       await checkAuthStatus();
//     } catch (err) {
//       const msg = err instanceof Error ? err.message : "Sign in failed";
//       setError(msg);
//     }
//   };

//   const signOut = async (): Promise<void> => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }

//     set({ isLoading: true, error: null });

//     try {
//       await puter.auth.signOut();
//       set({
//         auth: {
//           user: null,
//           isAuthenticated: false,
//           signIn: get().auth.signIn,
//           signOut: get().auth.signOut,
//           refreshUser: get().auth.refreshUser,
//           checkAuthStatus: get().auth.checkAuthStatus,
//           getUser: () => null,
//         },
//         isLoading: false,
//       });
//     } catch (err) {
//       const msg = err instanceof Error ? err.message : "Sign out failed";
//       setError(msg);
//     }
//   };

//   const refreshUser = async (): Promise<void> => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }

//     set({ isLoading: true, error: null });

//     try {
//       const user = await puter.auth.getUser();
//       set({
//         auth: {
//           user,
//           isAuthenticated: true,
//           signIn: get().auth.signIn,
//           signOut: get().auth.signOut,
//           refreshUser: get().auth.refreshUser,
//           checkAuthStatus: get().auth.checkAuthStatus,
//           getUser: () => user,
//         },
//         isLoading: false,
//       });
//     } catch (err) {
//       const msg = err instanceof Error ? err.message : "Failed to refresh user";
//       setError(msg);
//     }
//   };

//   const init = (): void => {
//     const puter = getPuter();
//     if (puter) {
//       set({ puterReady: true });
//       checkAuthStatus();
//       return;
//     }

//     const interval = setInterval(() => {
//       if (getPuter()) {
//         clearInterval(interval);
//         set({ puterReady: true });
//         checkAuthStatus();
//       }
//     }, 100);

//     setTimeout(() => {
//       clearInterval(interval);
//       if (!getPuter()) {
//         setError("Puter.js failed to load within 10 seconds");
//       }
//     }, 10000);
//   };

//   const write = async (path: string, data: string | File | Blob) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.fs.write(path, data);
//   };

//   const readDir = async (path: string) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.fs.readdir(path);
//   };

//   const readFile = async (path: string) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.fs.read(path);
//   };

//   const upload = async (files: File[] | Blob[]) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.fs.upload(files);
//   };

//   const deleteFile = async (path: string) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.fs.delete(path);
//   };

//   const chat = async (
//     prompt: string | ChatMessage[],
//     imageURL?: string | PuterChatOptions,
//     testMode?: boolean,
//     options?: PuterChatOptions
//   ) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     // return puter.ai.chat(prompt, imageURL, testMode, options);
//     return puter.ai.chat(prompt, imageURL, testMode, options) as Promise<
//       AIResponse | undefined
//     >;
//   };

//   const feedback = async (path: string, message: string) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }

//     return puter.ai.chat(
//       [
//         {
//           role: "system",
//           content:
//             "You are an ATS analyzer. Return ONLY valid JSON. Do not use markdown, backticks, or explanations.",
//         },
//         {
//           role: "user",
//           content: [
//             { type: "file", puter_path: path },
//             { type: "text", text: message },
//           ],
//         },
//       ],
//       { model: "anthropic/claude-sonnet-4-5" }
//     ) as Promise<AIResponse | undefined>;
//   };

//   const img2txt = async (image: string | File | Blob, testMode?: boolean) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.ai.img2txt(image, testMode);
//   };

//   const getKV = async (key: string) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.kv.get(key);
//   };

//   const setKV = async (key: string, value: string) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.kv.set(key, value);
//   };

//   const deleteKV = async (key: string) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.kv.delete(key);
//   };

//   const listKV = async (pattern: string, returnValues?: boolean) => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     if (returnValues === undefined) {
//       returnValues = false;
//     }
//     return puter.kv.list(pattern, returnValues);
//   };

//   const flushKV = async () => {
//     const puter = getPuter();
//     if (!puter) {
//       setError("Puter.js not available");
//       return;
//     }
//     return puter.kv.flush();
//   };

//   return {
//     isLoading: true,
//     error: null,
//     puterReady: false,
//     auth: {
//       user: null,
//       isAuthenticated: false,
//       signIn,
//       signOut,
//       refreshUser,
//       checkAuthStatus,
//       getUser: () => get().auth.user,
//     },
//     fs: {
//       write: (path: string, data: string | File | Blob) => write(path, data),
//       read: (path: string) => readFile(path),
//       readDir: (path: string) => readDir(path),
//       upload: (files: File[] | Blob[]) => upload(files),
//       delete: (path: string) => deleteFile(path),
//     },
//     ai: {
//       chat: (
//         prompt: string | ChatMessage[],
//         imageURL?: string | PuterChatOptions,
//         testMode?: boolean,
//         options?: PuterChatOptions
//       ) => chat(prompt, imageURL, testMode, options),
//       feedback: (path: string, message: string) => feedback(path, message),
//       img2txt: (image: string | File | Blob, testMode?: boolean) =>
//         img2txt(image, testMode),
//     },
//     kv: {
//       get: (key: string) => getKV(key),
//       set: (key: string, value: string) => setKV(key, value),
//       delete: (key: string) => deleteKV(key),
//       list: (pattern: string, returnValues?: boolean) =>
//         listKV(pattern, returnValues),
//       flush: () => flushKV(),
//     },
//     init,
//     clearError: () => set({ error: null }),
//   };
// });
import { create } from "zustand";

declare global {
  interface Window {
    puter: {
      auth: {
        getUser: () => Promise<PuterUser>;
        isSignedIn: () => Promise<boolean>;
        signIn: () => Promise<void>;
        signOut: () => Promise<void>;
      };

      fs: {
        write: (
          path: string,
          data: string | File | Blob
        ) => Promise<File | undefined>;

        read: (path: string) => Promise<Blob>;

        upload: (file: File[] | Blob[]) => Promise<FSItem>;

        delete: (path: string) => Promise<void>;

        readdir: (path: string) => Promise<FSItem[] | undefined>;
      };

      ai: {
        chat: (
          prompt: string | ChatMessage[],
          imageURL?: string | PuterChatOptions,
          testMode?: boolean,
          options?: PuterChatOptions
        ) => Promise<AIResponse>;

        img2txt: (
          image: string | File | Blob,
          testMode?: boolean
        ) => Promise<string>;
      };

      kv: {
        get: (key: string) => Promise<string | null>;

        set: (key: string, value: string) => Promise<boolean>;

        delete: (key: string) => Promise<boolean>;

        list: (
          pattern: string,
          returnValues?: boolean
        ) => Promise<string[]>;

        flush: () => Promise<boolean>;
      };
    };
  }
}

interface PuterStore {
  isLoading: boolean;
  error: string | null;
  puterReady: boolean;

  auth: {
    user: PuterUser | null;
    isAuthenticated: boolean;

    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
    checkAuthStatus: () => Promise<boolean>;
    getUser: () => PuterUser | null;
  };

  fs: {
    write: (
      path: string,
      data: string | File | Blob
    ) => Promise<File | undefined>;

    read: (path: string) => Promise<Blob | undefined>;

    upload: (file: File[] | Blob[]) => Promise<FSItem | undefined>;

    delete: (path: string) => Promise<void>;

    readDir: (path: string) => Promise<FSItem[] | undefined>;
  };

  ai: {
    chat: (
      prompt: string | ChatMessage[],
      imageURL?: string | PuterChatOptions,
      testMode?: boolean,
      options?: PuterChatOptions
    ) => Promise<AIResponse | undefined>;

    feedback: (
      path: string,
      message: string
    ) => Promise<AIResponse | undefined>;

    img2txt: (
      image: string | File | Blob,
      testMode?: boolean
    ) => Promise<string | undefined>;
  };

  kv: {
    get: (key: string) => Promise<string | null | undefined>;

    set: (key: string, value: string) => Promise<boolean | undefined>;

    delete: (key: string) => Promise<boolean | undefined>;

    list: (
      pattern: string,
      returnValues?: boolean
    ) => Promise<string[] | KVItem[] | undefined>;

    flush: () => Promise<boolean | undefined>;
  };

  init: () => void;

  clearError: () => void;
}

const getPuter = (): typeof window.puter | null =>
  typeof window !== "undefined" && window.puter
    ? window.puter
    : null;

const requirePuter = () => {
  const puter = getPuter();

  if (!puter) {
    throw new Error("Puter.js not available");
  }

  return puter;
};

export const usePuterStore = create<PuterStore>((set, get) => {
  const setError = (msg: string) => {
    set({
      error: msg,
      isLoading: false,
    });
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const puter = requirePuter();

      set({ isLoading: true, error: null });

      const isSignedIn = await puter.auth.isSignedIn();

      if (isSignedIn) {
        const user = await puter.auth.getUser();

        set({
          auth: {
            user,
            isAuthenticated: true,
            signIn,
            signOut,
            refreshUser,
            checkAuthStatus,
            getUser: () => user,
          },

          isLoading: false,
        });

        return true;
      }

      set({
        auth: {
          user: null,
          isAuthenticated: false,
          signIn,
          signOut,
          refreshUser,
          checkAuthStatus,
          getUser: () => null,
        },

        isLoading: false,
      });

      return false;
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to check auth status";

      setError(msg);

      return false;
    }
  };

  const signIn = async (): Promise<void> => {
    try {
      const puter = requirePuter();

      set({ isLoading: true, error: null });

      await puter.auth.signIn();

      await checkAuthStatus();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Sign in failed";

      setError(msg);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const puter = requirePuter();

      set({ isLoading: true, error: null });

      await puter.auth.signOut();

      set({
        auth: {
          user: null,
          isAuthenticated: false,
          signIn,
          signOut,
          refreshUser,
          checkAuthStatus,
          getUser: () => null,
        },

        isLoading: false,
      });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Sign out failed";

      setError(msg);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const puter = requirePuter();

      set({ isLoading: true, error: null });

      const user = await puter.auth.getUser();

      set({
        auth: {
          user,
          isAuthenticated: true,
          signIn,
          signOut,
          refreshUser,
          checkAuthStatus,
          getUser: () => user,
        },

        isLoading: false,
      });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to refresh user";

      setError(msg);
    }
  };

  const init = (): void => {
    const puter = getPuter();

    if (puter) {
      set({ puterReady: true });

      checkAuthStatus();

      return;
    }

    const interval = setInterval(() => {
      if (getPuter()) {
        clearInterval(interval);

        set({ puterReady: true });

        checkAuthStatus();
      }
    }, 100);

    setTimeout(() => {
      clearInterval(interval);

      if (!getPuter()) {
        setError("Puter.js failed to load within 10 seconds");
      }
    }, 10000);
  };

  const write = async (
    path: string,
    data: string | File | Blob
  ) => {
    try {
      const puter = requirePuter();

      return await puter.fs.write(path, data);
    } catch (err) {
      console.error(err);

      setError("Failed to write file");
    }
  };

  const readFile = async (path: string) => {
    try {
      const puter = requirePuter();

      return await puter.fs.read(path);
    } catch (err) {
      console.error(err);

      setError("Failed to read file");
    }
  };

  const readDir = async (path: string) => {
    try {
      const puter = requirePuter();

      return await puter.fs.readdir(path);
    } catch (err) {
      console.error(err);

      setError("Failed to read directory");
    }
  };

  const upload = async (files: File[] | Blob[]) => {
    try {
      const puter = requirePuter();

      return await puter.fs.upload(files);
    } catch (err) {
      console.error(err);

      setError("Failed to upload file");
    }
  };

  const deleteFile = async (path: string) => {
    try {
      const puter = requirePuter();

      await puter.fs.delete(path);
    } catch (err) {
      console.error(err);

      setError("Failed to delete file");
    }
  };

  const chat = async (
    prompt: string | ChatMessage[],
    imageURL?: string | PuterChatOptions,
    testMode?: boolean,
    options?: PuterChatOptions
  ) => {
    try {
      const puter = requirePuter();

      return await puter.ai.chat(
        prompt,
        imageURL,
        testMode,
        options
      );
    } catch (err) {
      console.error(err);

      setError("AI chat failed");
    }
  };

  const feedback = async (
    path: string,
    message: string
  ) => {
    try {
      const puter = requirePuter();

      return await puter.ai.chat(
        [
          {
            role: "system",
            content:
              "You are an ATS analyzer. Return ONLY valid JSON. Do not use markdown, backticks, explanations, or extra text.",
          },

          {
            role: "user",

            content: [
              {
                type: "file",
                puter_path: path,
              },

              {
                type: "text",
                text: message,
              },
            ],
          },
        ],

        {
          model: "anthropic/claude-sonnet-4-5",
        }
      );
    } catch (err) {
      console.error(err);

      setError("AI feedback generation failed");
    }
  };

  const img2txt = async (
    image: string | File | Blob,
    testMode?: boolean
  ) => {
    try {
      const puter = requirePuter();

      return await puter.ai.img2txt(image, testMode);
    } catch (err) {
      console.error(err);

      setError("Image to text failed");
    }
  };

  const getKV = async (key: string) => {
    try {
      const puter = requirePuter();

      return await puter.kv.get(key);
    } catch (err) {
      console.error(err);

      setError("KV get failed");
    }
  };

  const setKV = async (
    key: string,
    value: string
  ) => {
    try {
      const puter = requirePuter();

      return await puter.kv.set(key, value);
    } catch (err) {
      console.error(err);

      setError("KV set failed");
    }
  };

  const deleteKV = async (key: string) => {
    try {
      const puter = requirePuter();

      return await puter.kv.delete(key);
    } catch (err) {
      console.error(err);

      setError("KV delete failed");
    }
  };

  const listKV = async (
    pattern: string,
    returnValues?: boolean
  ) => {
    try {
      const puter = requirePuter();

      return await puter.kv.list(
        pattern,
        returnValues ?? false
      );
    } catch (err) {
      console.error(err);

      setError("KV list failed");
    }
  };

  const flushKV = async () => {
    try {
      const puter = requirePuter();

      return await puter.kv.flush();
    } catch (err) {
      console.error(err);

      setError("KV flush failed");
    }
  };

  return {
    isLoading: true,

    error: null,

    puterReady: false,

    auth: {
      user: null,

      isAuthenticated: false,

      signIn,

      signOut,

      refreshUser,

      checkAuthStatus,

      getUser: () => get().auth.user,
    },

    fs: {
      write,

      read: readFile,

      readDir,

      upload,

      delete: deleteFile,
    },

    ai: {
      chat,

      feedback,

      img2txt,
    },

    kv: {
      get: getKV,

      set: setKV,

      delete: deleteKV,

      list: listKV,

      flush: flushKV,
    },

    init,

    clearError: () => set({ error: null }),
  };
});
