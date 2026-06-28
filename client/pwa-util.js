import { Meteor } from 'meteor/meteor';

export const isPwa = !!window.matchMedia('(display-mode: standalone)').matches;
export const isMobile = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
export const isStandalone = Boolean(Meteor.isDevelopment || isPwa || !isMobile);
