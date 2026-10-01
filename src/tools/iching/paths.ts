export const ICHING_SLUG = 'kinh-dich';
export const CAST_PATH = `/${ICHING_SLUG}/gieo-que`;
export const LOOKUP_PATH = `/${ICHING_SLUG}/tra-cuu`;
export const hexagramPath = (n: number) => `${LOOKUP_PATH}/que/${n}`;
