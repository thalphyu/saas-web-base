
export interface IGadget {

    run();

    stop();

    toggleConfigMode();

    initializeProperties();

    updateProperties(updatedProperties: any);

    getData(data: any[]);

    handleError(error: any);

    remove();

    showGadgetControls(enable: boolean);

    configureGadget(instanceId: number, config: any, tags: Array<any>);

    updateGadgetWithGlobalOptions(options: any);


}
