const Order = require("./assignment1Order");

const OrderState = Object.freeze({
    WELCOMING: Symbol("welcoming"),
    DishInfo: Symbol('DishInfo'),
    mSize: Symbol('Fish and chips'),
    nSize: Symbol('Chicken Burger'),
    sauce: Symbol('Sauce'),
    ThankYou: Symbol('Thank You'),
    DRINKS: Symbol('Drinks'),
    PAYMENT: Symbol('Payment'),
    wrong: Symbol('Wrong')
});

module.exports = class ShwarmaOrder extends Order {
    constructor() {
        super();
        this.stateCur = OrderState.WELCOMING;
        this.mSize = "";
        this.nSize = "";
        this.mToppings = "";
        this.nTopping = "";
        this.sItem = "shawarama";
        this.cart = "";
        this.orderItems = [];
    }
    handleInput(sInput) {
        let aReturn = [];
        switch (this.stateCur) {
            case OrderState.WELCOMING:
                this.stateCur = OrderState.SIZE;
                this.stateCur = OrderState.DishInfo;
                aReturn.push("Welcome to Surendra's Kitchen.");
                aReturn.push("What would you like to order, Fish and Chips or Chicken Burger");
                break;
            case OrderState.DishInfo:
                if (sInput.toLowerCase() == 'f') {
                    this.stateCur = OrderState.mSize;
                    this.orderItems.push('Fish and Chips');
                    aReturn.push('Quantity of the Fish and Chips');
                    break;
                } else if (sInput.toLowerCase() == 'c') {
                    this.stateCur = OrderState.nSize;
                    this.orderItems.push('Chicken Burger');
                    aReturn.push('Size of the Chicken Burger');
                    break;
                }
                break;
            case OrderState.wrong:
                this.stateCur = OrderState.DishInfo;
                break;
            case OrderState.nSize:
                aReturn.push('Please select the Sauce you want');
                this.orderItems.push(sInput);
                this.stateCur = OrderState.sauce
                break;
            case OrderState.mSize:
                aReturn.push('Please select the Sauce you want');
                this.orderItems.push(sInput);
                this.stateCur = OrderState.sauce;
                break;

            case OrderState.sauce:
                this.stateCur = OrderState.DRINKS;
                this.orderItems.push(sInput);
                aReturn.push("Would you like drinks with that?");
                break;
            case OrderState.DRINKS:
                    this.stateCur = OrderState.PAYMENT;
                    this.nOrder = 15;
                    if(sInput.toLowerCase() != "no"){
                        this.sDrinks = sInput;
                    }
                    aReturn.push("Thank-you for your order of");
                    aReturn.push(`${this.sSize} ${this.sItem} with ${this.sToppings}`);
                    if(this.sDrinks){
                        aReturn.push(this.sDrinks);
                    }
                    aReturn.push(`Please pay for your order here`);
                    aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
                    break;
            case OrderState.PAYMENT:
                    console.log(sInput);
                    this.isDone(true);
                    let d = new Date();
                    d.setMinutes(d.getMinutes() + 20);
                    aReturn.push(`Your order will be delivered at ${d.toTimeString()}`);
                    break;
            // case OrderState.PAYMENT:
            //     console.log(sInput);
            //     this.isDone(true);
            //     d = new Date();
            //     d.setMinutes(d.getMinutes() + 20);
            //     aReturn.push(`Your order will be delivered at ${d.toTimeString()}`);
            //     break;
            // case OrderState.ThankYou:
            //     this.isDone(true);
            //     if (sInput.toLowerCase() != "no") {
            //         this.sDrinks = sInput;
            //     }
            //     aReturn.push("Thank you, Your order is");
            //     aReturn.push(`${this.orderItems[0]} ${this.orderItems[1]} with ${this.orderItems[2]} Toppings`);
            //     if (this.sDrinks) {
            //         aReturn.push('With drinks');
            //     }
            //     let d = new Date();
            //     d.setMinutes(d.getMinutes() + 20);
            //     aReturn.push(`Please pick up at ${d.toTimeString()}`);
            //     break;

        }
        return aReturn;
    }
}