// Esercizio: Sistema di Gestione di una Biblioteca con Programmazione ad Oggetti in JavaScript
// 
// 
// Obiettivo:Creare un sistema di gestione di una biblioteca
// Requisiti:

//     Classi Principali:
//         Book: Rappresenta un libro generico.
//         PhysicalBook: Eredita da Book e rappresenta un libro fisico con una posizione sugli scaffali.
//         EBook: Eredita da Book e rappresenta un libro elettronico con un formato di file.
//         User: Rappresenta un utente della biblioteca.
//         PremiumUser: Eredita da User e rappresenta un utente premium con un limite massimo di libri che può prendere in prestito estendibile.
//         Library: Gestisce i libri e gli utenti della biblioteca.

//     Proprietà e Metodi:
//         Book:
//             Proprietà: title, author, isbn
//             Metodi: toString().
//         PhysicalBook:
//             Proprietà aggiuntiva: shelfLocation.
//         EBook:
//             Proprietà aggiuntiva: fileFormat.
//         User:
//             Proprietà: name, id, borrowedBooks, maxBorrowLimit(statica) = 3
//             Metodi: borrowBook(book), returnBook(book), borrowedBooksNumber(getter).
//         PremiumUser:
//             Metodo aggiuntivo: extendBorrowLimit(newLimit).
//         Library:
//             Proprietà: books, users.
//             Metodi: addBook(book), removeBook(book), isBookAvailable(isbn), addUser(user), removeUser(user), listBooks(), listUsers(), borrowBook(user, book), returnBook(user, book).

//     Funzionalità:
//         Aggiungere e rimuovere libri dalla biblioteca.
//         Aggiungere e rimuovere utenti dalla biblioteca.
//         Gestire il prestito e la restituzione dei libri agli utenti.
//         Visualizzare l'elenco dei libri disponibili e degli utenti registrati.


class Book {
    
    constructor(isbn, title, author) {
        this.author = author;
        this.title = title;
        this.isbn = isbn;
    }

    toString(){
        return `ISBN: ${this.isbn}\n` + 
               `Titolo: ${this.title}\n` +
               `Author: ${this.author}`
    }

}

class PhysicalBook extends Book {

    constructor(isbn, title, author, shelfLocation) {
        super(isbn, title, author);
        this.shelfLocation = shelfLocation;
        this.isBorrowed = false;
    }

    toString(){
        return super.toString() + '\n' +
               `Shelf: ${this.shelfLocation}\n` +
               `Is borrowed: ${this.isBorrowed}\n`
    }

}

class EBook extends Book {

    constructor(isbn, title, author, fileFormat) {
        super(isbn, title, author);
        this.fileFormat = fileFormat;
    }

    toString(){
        return super.toString() + '\n' +
               `Format: ${this.fileFormat}`
    }

}


class User {

    static MAX_BORROW_LIMIT = 3;

    constructor(id, name, borrowedBooks = []) {
        this.name = name;
        this.id = id;
        this.borrowedBooks = borrowedBooks;
    }
    
    get borrowedBooksNumber(){
        return this.borrowedBooks.length;
    }

    borrowBook(book){
        if (this.borrowedBooksNumber < User.MAX_BORROW_LIMIT) {
            this.borrowedBooks.push(book);
        } else {
            console.log('superato il limite, passa a premium!!');
        }
    }
    
    returnBook(book){
        this.borrowedBooks = this.borrowedBooks.filter(borrowed => borrowed.isbn !== book.isbn)
    }

    toString(){
        return `ID: ${this.id}\n` + 
               `Name: ${this.name}\n` +
               `Borrowed Number: ${this.borrowedBooksNumber}`
    }

}

class PremiumUser extends User {

    constructor(id, name, borrowedBooks = []) {
        super(id, name, borrowedBooks);
        this.premiumLimit = User.MAX_BORROW_LIMIT;
    }

    extendBorrowLimit(newLimit){
        this.premiumLimit = newLimit;
    }

    borrowBook(book){
        if (this.borrowedBooksNumber < this.premiumLimit) {
            this.borrowedBooks.push(book);
        } else {
            console.log('superato il limite, passa a premium!!');
        }
    }

    toString(){
        return super.toString() + '\n' +
               `Borrow Limit: ${this.premiumLimit}`
    }

}


class Library {

    constructor(name, books = [], users = []) {
        this.name = name;
        this.books = books;
        this.users = users;
    }

    get booksNumber(){
        return this.books.length;
    }

    get usersNumber(){
        return this.users.length;
    }

    addBook(book){
        this.books.push(book);
    } 
    
    removeBook(bookToRemove){
        this.books = this.books.filter(book => book.isbn !== bookToRemove.isbn);
    } 
    
    isBookAvailable(isbn){
        const book = this.books.find(book => book.isbn === isbn);
        if(!book){
            return false;
        } else {
            if (!book.isBorrowed) {
                return true;
            } else {
                return false;
            }
        }
    } 
    
    addUser(user){
        this.users.push(user);
    } 
    
    removeUser(userToRemove){
        this.users = this.users.filter(user => user.id !== userToRemove.id);
    } 
    
    listBooks(){
        this.books.forEach(book => console.log(book.toString()));
    } 
    
    listUsers(){
        for (const user of this.users) {
            console.log(user.toString());
        }
    } 
    
    borrowBook(user, book){
        const isAvailable = this.isBookAvailable(book.isbn);
        if(!isAvailable){
            console.log('libro non disponibile')
        } else {
            user.borrowBook(book);
            const isPhysical = book instanceof PhysicalBook;
            if (isPhysical) {
                book.isBorrowed = true;
            }
        }
    } 
    
    returnBook(user, book){
        user.returnBook(book);
        const isPhysical = book instanceof PhysicalBook;
        if (isPhysical) {
            book.isBorrowed = false;
        }
    }

    toString(){
        return `Name: ${this.name}\n` + 
               `Books number: ${this.booksNumber}\n` +
               `User number: ${this.usersNumber}`
    }

}




const book1 = new PhysicalBook('123415', 'iliade', 'omero', 'h27');
const book2 = new EBook('456346', 'odissea', 'omero', 'pdf');

const user1 = new User('1', 'andrea');
const user2 = new PremiumUser('2', 'hugo');
user2.extendBorrowLimit(10);

const library = new Library('berio');
library.addBook(book1);
library.addBook(book2);
library.addUser(user1);
library.addUser(user2);
console.log(library.toString());

library.borrowBook(user2, book1);
library.borrowBook(user2, book2);

library.returnBook(user2, book1);

library.listBooks();
library.listUsers();

