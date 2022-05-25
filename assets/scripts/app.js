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
    element.scrollIntoView({ behavior: "smooth" });
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
    this.connectDroppable();
  }
  connectDroppable() {
    const list = document.querySelector(`#${this.type}-projects ul`);
    list.addEventListener("dragenter", event => {
      list.parentElement.classList.add("droppable");
      event.preventDefault();
    });
    list.addEventListener("dragover", event => event.preventDefault());
    list.addEventListener("dragleave", event => {
      if (event.relatedTarget.closest(`#${this.type}-projects ul`) !== list) {
        list.parentElement.classList.remove("droppable");
      }
    });

    list.addEventListener("drop", event => {
      const prjId = event.dataTransfer.getData("text/plain");
      console.log(prjId);
      if (this.projects.find(p => p.id === prjId)) {
        return;
      }
      document
        .getElementById(prjId)
        .querySelector("button:last-of-type")
        .click();
      list.parentElement.classList.remove("droppable");
    });
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
  constructor(closeNotifierFunction, text, hostElementId) {
    super(hostElementId);
    this.text = text;
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
    const templateEl = document.getElementById("tooltip-info");
    const tooltipBody = document.importNode(templateEl.content, true);
    tooltipBody.querySelector("p").textContent = this.text;
    tooltipElement.append(tooltipBody);
    const hostElPosLeft = this.hostElement.offsetLeft;
    const hostElPosTop = this.hostElement.offsetTop;
    const hostElHeight = this.hostElement.clientHeight;
    const parentElementScrolling = this.hostElement.parentElement.scrollTop;

    const x = hostElPosLeft + 20;
    const y = hostElPosTop + hostElHeight - parentElementScrolling - 10;
    tooltipElement.style.position = "absolute";
    tooltipElement.style.left = x + "px";
    tooltipElement.style.top = y + "px";
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
    this.connectDrag();
  }
  showMoreInfoHandler() {
    if (this.hasActiveTooltip) {
      return;
    }
    const projectItem = document.getElementById(this.id);
    const tooltipText = projectItem.dataset.extraInfo;
    const tooltip = new Tooltip(
      () => {
        this.hasActiveTooltip = false;
      },
      tooltipText,
      this.id
    );
    tooltip.attach();
    this.hasActiveTooltip = true;
  }

  connectDrag() {
    document.getElementById(this.id).addEventListener("dragstart", event => {
      event.dataTransfer.setData("text/plain", this.id);
      event.dataTransfer.effectAllowed = "move";
    });
  }

  connectInfoButton() {
    const projectItemElement = document.getElementById(this.id);
    let moreInfoButton = projectItemElement.querySelector(
      "button:first-of-type"
    );
    moreInfoButton.addEventListener(
      "click",
      this.showMoreInfoHandler.bind(this)
    );
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
    // const analyticBtn = document.getElementById("analytic");
    // analyticBtn.addEventListener("click", this.startAnalytic);
    // const timerId = setTimeout(this.startAnalytic, 3000);
    // const analyticBtn = document.getElementById("analytic");
    // analyticBtn.addEventListener("click", () => {
    //   clearTimeout(timerId);
    // });
  }

  static startAnalytic() {
    const analyticScript = document.createElement("script");
    analyticScript.src = "assets/scripts/analytic.js";
    analyticScript.defer = true;
    document.head.append(analyticScript);
  }
}

App.init();
