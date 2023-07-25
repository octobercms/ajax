declare module 'octobercms';

type Constructor<T> = new (...args: any[]) => T;

type ResponseCallback<T> = (data: T, statusCode: number, xhr: XMLHttpRequest) => void;

type DataResponse = Record<string, unknown>;

export interface ProgressBar {
    show: () => void;
    hide: () => void;
}

export interface RequestOptions<T = unknown> {
    update?: Record<string, string>;
    confirm?: string;
    data?: unknown;
    query?: unknown;
    headers?: Record<string, string>;
    redirect?: string;
    beforeUpdate?: ResponseCallback<T>;
    afterUpdate?: ResponseCallback<T>;
    success?: ResponseCallback<T>;
    error?: ResponseCallback<T>;
    complete?: () => void;
    form?: HTMLElement | string;
    flash?: boolean | string;
    files?: FormData;
    download?: boolean;
    bulk?: boolean;
    browserValidate?: boolean;
    browserTarget?: string;
    loading?: string;
    progressBar?: boolean;
    handleConfirmMessage?: (message: string, promise: Promise<void>) => void;
    handleErrorMessage?: (message: string) => void;
    handleValidationMessage?: (message: string, fields: Record<string, string[]>) => void;
    handleFlashMessage?: (message: string, type: string) => void;
    handleRedirectResponse?: (url: string) => void;
}

export interface Deferred {
    resolve: (...args) => Deferred;
    reject: (...args) => Deferred;
    notify: (...args) => Deferred;
    abort: () => void;
    done: (...args) => Deferred;
    fail: (...args) => Deferred;
    progress: (...args) => Deferred;
    always: (...args) => Deferred;
    then: (...args) => Deferred;
    promise: (...args) => Deferred;
}

export interface AjaxEventContext {
    el: Document | HTMLElement;
    handler: string;
    options: RequestOptions;
}

export interface AjaxBeforeSendEvent extends Event {
    detail: {
        context: AjaxEventContext;
    };
}

export interface AjaxUpdateEvent extends Event {
    detail: {
        context: AjaxEventContext;
        data: DataResponse;
        responseCode: number;
        xhr: XMLHttpRequest;
    };
}

export interface AjaxBeforeUpdateEvent extends AjaxUpdateEvent {

}

export interface AjaxUpdateCompleteEvent extends AjaxUpdateEvent {

}

export interface AjaxRequestResponseEvent extends Event {
    detail: {
        context: AjaxEventContext;
        data: DataResponse;
        responseCode: number;
        xhr: XMLHttpRequest;
    };
}

export interface AjaxRequestSuccessEvent extends AjaxRequestResponseEvent {

}

export interface AjaxRequestErrorEvent extends AjaxRequestResponseEvent {

}

export interface AjaxErrorMessageEvent extends Event {
    detail: {
        message: string;
    }
}

export interface AjaxConfirmMessageEvent extends Event {
    detail: {
        message: string;
        promise: Deferred;
    };
}

export interface AjaxSetupEvent extends Event {
    detail: {
        context: AjaxEventContext;
    };
}

export interface AjaxPromiseEvent extends Event {
    detail: {
        context: AjaxEventContext;
    }
}

export interface AjaxFailEvent extends AjaxRequestResponseEvent {

}

export interface AjaxDoneEvent extends AjaxRequestResponseEvent {

}

export interface AjaxAlwaysEvent extends AjaxRequestResponseEvent {

}

export interface AjaxInvalidFieldEvent extends Event {
    detail: {
        element: HTMLElement;
        fieldName: string;
        errorMsg: string;
        isFirst: boolean;
    };
}

export interface ObserveControlBase {
    init: () => void;
    connect: () => void;
    disconnect: () => void;
}

declare function ajax<T = unknown>(handler: string, options: RequestOptions<T>): void;
declare function request<T = unknown>(element: HTMLElement | string, handler: string, options: RequestOptions<T>): void;
declare function parseJson(json: string): void;
declare function flashMsg(options: { text: string, class: string, interval?: number }): void;
declare function useTurbo(): boolean;
declare function visit(location: string, options?: { scroll?: boolean; action: string }): void;
declare function registerControl(id: string, control: Constructor<ObserveControlBase>): void;
declare function importControl(id: string): void;
declare function fetchControl(element: HTMLElement | string): void;
declare function fetchControls(element: HTMLElement | string): void;
declare var progressBar: ProgressBar;

export {
    ajax,
    request,
    parseJson,
    flashMsg,
    progressBar,
    useTurbo,
    visit,
    registerControl,
    importControl,
    fetchControl,
    fetchControls
};

declare global {
    interface Window {
        oc: {
            ajax: typeof ajax;
            request: typeof request;
            parseJson: typeof parseJson;
            flashMsg: typeof flashMsg;
            progressBar?: typeof progressBar; // Optional, only available with extra's
            useTurbo?: typeof useTurbo; // Optional, only available with turbo
            visit?: typeof visit; // Optional, only available with turbo
            ControlBase?: typeof ObserveControlBase; // Optional, only available with observe
            registerControl?: typeof registerControl; // Optional, only available with observe
            importControl?: typeof importControl; // Optional, only available with observe
            fetchControl?: typeof fetchControl; // Optional, only available with observe
            fetchControls?: typeof fetchControls; // Optional, only available with observe
        },
    }

    interface GlobalEventHandlersEventMap {
        'ajax:before-send': AjaxBeforeSendEvent;
        'ajax:before-update': AjaxBeforeUpdateEvent;
        'ajax:update': AjaxUpdateEvent;
        'ajax:update-complete': AjaxUpdateCompleteEvent;
        'ajax:request-success': AjaxRequestSuccessEvent;
        'ajax:request-error': AjaxRequestErrorEvent;
        'ajax:error-message': AjaxErrorMessageEvent;
        'ajax:confirm-message': AjaxConfirmMessageEvent;
        'ajax:setup': AjaxSetupEvent;
        'ajax:promise': AjaxPromiseEvent;
        'ajax:fail': AjaxFailEvent;
        'ajax:done': AjaxDoneEvent;
        'ajax:always': AjaxAlwaysEvent;
        'ajax:invalid-field': AjaxInvalidFieldEvent;
    }
}
