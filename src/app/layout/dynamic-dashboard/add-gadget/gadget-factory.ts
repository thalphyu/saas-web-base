
import { AnnouncementGadgetComponent } from '../gadgets/announcement-gadget/announcement-gadget.component';



export class GadgetFactory {


    /**
     * todo - return new instances  instead of the same instance. This requires the creation of new configuration options.
     *
     * @param gadgetType
     * @returns {any}
     */

    static getComponentType(gadgetType): any {

        switch (gadgetType) {
            case 'AnnouncementGadgetComponent':
                return AnnouncementGadgetComponent;
            default:
                return null;// todo add default gadget that would be displayed. Useful for troubleshooting new gadget dev

        }
    }
}
