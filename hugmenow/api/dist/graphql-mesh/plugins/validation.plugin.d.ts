export default class ValidationPlugin {
    private readonly logger;
    onInit(options: any): any;
    onExecute(execute: any): any;
    private createMaxDepthValidationRule;
    private createMaxAliasesValidationRule;
    private createDisableIntrospectionRule;
    private formatError;
    private getErrorCode;
    private getUserFriendlyMessage;
}
