import { EventEmitter } from "events";
import dispatcher from '../dispatcher/BuilderDispatcher';

class BuilderStore extends EventEmitter {

    _selectedInterest = null;
    _allowTap = false;
    _intro = true;


    applyInterest = (appliedInterest) => {
        this._allowTap = true;
        this._selectedInterest = null;
        this.emit("applyInterest", appliedInterest);
    }

    beginCustomization = (status) => {
        this._intro = status;
        this.emit("beginCustomization", this._intro);
      }

    handleActions(action) {

        switch (action.type) {

            case 'APPLY_INTEREST':
                this.applyInterest(action.interest);
                break;
            case "BEGIN_CUSTOMIZATION":
                this.beginCustomization(action.status);
                break;
            default:
        }
    }
}

const builderStore = new BuilderStore();
dispatcher.register(builderStore.handleActions.bind(builderStore));

export default builderStore;