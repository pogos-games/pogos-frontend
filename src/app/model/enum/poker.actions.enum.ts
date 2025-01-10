
export enum PokerActions{
    // If there is nu current bet, the player can bet. The others will have to raise or follow
    BET    = "BET",
    // Math the amount of the current bet
    CALL   = "CALL",
    // Increase the amount of the current bet / raise
    RAISE  = "RAISE",
    // Surrending (se coucher)
    FOLD   = "FOLD",    
    CHECK  = "CHECK",
    ALL_IN = "ALL_IN",
}