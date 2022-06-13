
export class Migrate
{
    bind() {
        $.oc.flashMsg = window.oc.flashMsg;
        $.oc.stripeLoadIndicator = window.oc.progressBar;
    }
}
