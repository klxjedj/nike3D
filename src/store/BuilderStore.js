import { EventEmitter } from "events";
import dispatcher from '../dispatchers/BuilderDispatcher';

class BuilderStore extends EventEmitter {

    _selectedInterest = null;
    _allowTap = false;
    _intro = true;
    _shoe = null;
    _loaded = {
        _b16: 0,
        _3d: false
      };


    assetsLoaded = () => {
        // console.log('ASSETS LOADED')
        this._loaded['_3d'] = true;
        //this.emit("assetsLoaded", shoe, this._loaded);
        this.doneLoading();
      }

      doneLoading = () => {
        if (this._loaded['_3d']) {
          this.emit('doneLoading', true);
        }
      }
    applyInterest = (appliedInterest) => {
        this._allowTap = true;
        this._selectedInterest = null;
        this.emit("applyInterest", appliedInterest);
    }

    beginCustomization = (status) => {
        this._intro = status;
        this.emit("beginCustomization", this._intro);
    }

    selectShoe = (shoe) => {
        this._allowTap = true;
        this._shoe = shoe;
        this.emit("selectShoe", this._shoe);
    }

    handleActions(action) {

        switch (action.type) {

            case 'APPLY_INTEREST':
                this.applyInterest(action.interest);
                break;
            case "BEGIN_CUSTOMIZATION":
                this.beginCustomization(action.status);
                break;
            case "SELECT_SHOE":
                this.selectShoe(action.shoe);
                break;
            case "ASSETS_LOADED":
                this.assetsLoaded(action.shoe);
                break;
            default:
        }
    }
}

const builderStore = new BuilderStore();
dispatcher.register(builderStore.handleActions.bind(builderStore));

export default builderStore;