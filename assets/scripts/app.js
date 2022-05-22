class DOMHelper {
  static clearEventListeners(element) {
    const cloneElement = element.cloneNode(true);
    element.replaceWith(cloneElement);
    return cloneElement;
  }
  static move(elementId, newDestinationSelector) {
    const element = document.getElementById(elementId);
    const destinationElement = document.querySelector(newDestinationSelector);
    destinationElement.append(element);
  }
}

class ProductList {
  projects = [];
  constructor(type) {
    this.type = type;
    const prjItems = document.querySelectorAll(`#${type}-projects li`);

    for (const projItem of prjItems) {
      this.projects.push(
        new ProductItem(projItem.id, this.switchProduct.bind(this), this.type)
      );
    }
  }

  setSwitchHandlerFunction(switchHandlerFunction) {
    this.switchHandler = switchHandlerFunction;
  }
  addProduct(project) {
    this.projects.push(project);
    DOMHelper.move(project.id, `#${this.type}-projects ul`);
    project.update(this.switchProduct.bind(this), this.type);
  }
  switchProduct(productId) {
    this.switchHandler(this.projects.find(p => p.id === productId));
    this.projects = this.projects.filter(p => p.id !== productId);
  }
}
class Component {
  constructor(hostElementId, insertBefore = false) {
    if (hostElementId) {
      this.hostElement = document.getElementById(hostElementId);
    } else {
      this.hostElement = document.body;
    }
    this.insertBefore = insertBefore;
  }

  attach() {
    this.hostElement.insertAdjacentElement(
      this.insertBefore ? "afterbegin" : "beforeend",
      this.element
    );
  }

  detach() {
    if (this.element) {
      this.element.remove();
      // this.element.parentElement.removeChild(this.element);
    }
  }
}
class Tooltip extends Component {
  constructor(closeNotifierFunction) {
    super();
    this.closeNotifier = closeNotifierFunction;
    this.create();
  }
  closeTooltip() {
    this.detach();
    this.closeNotifier();
  }
  create() {
    const tooltipElement = document.createElement("div");
    tooltipElement.className = "card";
    tooltipElement.textContent = "DUMMY!";
    tooltipElement.addEventListener("click", this.closeTooltip.bind(this));
    this.element = tooltipElement;
  }
}

class ProductItem {
  hasActiveTooltip = false;
  constructor(id, updateProjectListsFunction, type) {
    this.id = id;
    this.updateProjectListsHandler = updateProjectListsFunction;
    this.connectInfoButton();
    this.connectSwitchButton(type);
  }
  showMoreInfoHandler() {
    if (this.hasActiveTooltip) {
      return;
    }
    const tooltip = new Tooltip(() => {
      this.hasActiveTooltip = false;
    });
    tooltip.attach();
    this.hasActiveTooltip = true;
  }

  connectInfoButton() {
    const projectItemElement = document.getElementById(this.id);
    let moreInfoButton = projectItemElement.querySelector(
      "button:first-of-type"
    );
    moreInfoButton.addEventListener("click", this.showMoreInfoHandler);
  }
  connectSwitchButton(type) {
    const projectItemElement = document.getElementById(this.id);
    let switchButton = projectItemElement.querySelector("button:last-of-type");
    switchButton = DOMHelper.clearEventListeners(switchButton);
    switchButton.textContent = type === "active" ? "Finish" : "Activate";
    switchButton.addEventListener(
      "click",
      this.updateProjectListsHandler.bind(null, this.id)
    );
  }
  update(updateProjectListsFn, type) {
    this.updateProjectListsHandler = updateProjectListsFn;
    this.connectSwitchButton(type);
  }
}

class App {
  static init() {
    const activeProjectsList = new ProductList("active");
    const finishedProjectsList = new ProductList("finished");
    activeProjectsList.setSwitchHandlerFunction(
      finishedProjectsList.addProduct.bind(finishedProjectsList)
    );
    finishedProjectsList.setSwitchHandlerFunction(
      activeProjectsList.addProduct.bind(activeProjectsList)
    );
  }
}

App.init();
