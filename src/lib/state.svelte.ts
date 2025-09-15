import { getContext, setContext } from "svelte";
import { getLocale, setLocale } from "$lib/paraglide/runtime";
import type { AvailableLanguageTags } from "./models";

class State {
  language = $state<AvailableLanguageTags>(getLocale());

  constructor() {
    // Initialize with current language tag
    this.language = getLocale();
  }

  setLanguage(lang: AvailableLanguageTags) {
    if (lang !== getLocale()) {
      setLocale(lang);
    }
  }

}

const STATE = Symbol('STATE');
export const setState = () => setContext<State>(STATE, new State());
export const getState = () => getContext<State>(STATE);

