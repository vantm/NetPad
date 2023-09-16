﻿import {ILogger} from "aurelia";
import {
    AlertUserAboutMissingAppDependencies,
    AlertUserCommand,
    ConfirmWithUserCommand,
    IEventBus,
    IIpcGateway,
    PromptUserCommand,
    YesNoCancel
} from "@domain";
import {IBackgroundService, WithDisposables} from "@common";
import {
    AppDependenciesCheckDialog
} from "@application/dialogs/app-dependencies-check-dialog/app-dependencies-check-dialog";
import {DialogUtil} from "@application/dialogs/dialog-util";

export class DialogBackgroundService extends WithDisposables implements IBackgroundService {
    private logger: ILogger;

    constructor(@IEventBus private readonly eventBus: IEventBus,
                @IIpcGateway private readonly ipcGateway: IIpcGateway,
                private readonly dialogUtil: DialogUtil,
                @ILogger logger: ILogger
    ) {
        super();
        this.logger = logger.scopeTo(nameof(DialogBackgroundService));
    }

    public start(): Promise<void> {
        this.addDisposable(
            this.eventBus.subscribeToServer(AlertUserCommand, async msg => await this.alert(msg))
        );

        this.addDisposable(
            this.eventBus.subscribeToServer(ConfirmWithUserCommand, async msg => await this.confirm(msg))
        );

        this.addDisposable(
            this.eventBus.subscribeToServer(PromptUserCommand, async msg => await this.prompt(msg))
        );

        this.addDisposable(
            this.eventBus.subscribeToServer(AlertUserAboutMissingAppDependencies, async msg => await this.alertUserAboutMissingAppDependencies(msg))
        );

        return Promise.resolve(undefined);
    }

    public stop(): void {
        this.dispose();
    }

    private async alert(command: AlertUserCommand) {
        alert(command.message);
    }

    private async confirm(command: ConfirmWithUserCommand) {
        const ync: YesNoCancel = confirm(command.message) ? "Yes" : "No";

        await this.ipcGateway.send("Respond", command.id, ync);
    }

    private async prompt(command: PromptUserCommand) {
        const newName = prompt(command.message, command.prefillValue);

        await this.ipcGateway.send("Respond", command.id, newName || null);
    }

    private async alertUserAboutMissingAppDependencies(command: AlertUserAboutMissingAppDependencies) {
        await this.dialogUtil.toggle(AppDependenciesCheckDialog, command.dependencyCheckResult);
    }
}
