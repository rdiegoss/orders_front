import { Component, Optional } from '@angular/core';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { OrdersService } from './services/orders.service';
declare var swal: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [OrdersService]
})
export class AppComponent {
  data: any;
  users: any;
  products: any;
  selectedUser: any;
  selectedProduct: any;
  selectedQtd: number;
  settings: any;
  source: LocalDataSource;
  listValuesUsers: any;
  listValuesProducts: any;

  constructor(private serviceOrder: OrdersService) {
    this.source = new LocalDataSource();

    this.serviceOrder.get('http://localhost:1337/products/all').then((result) => {
      this.listValuesProducts = [];
      this.products = result;

      this.products.forEach((value) => {
        this.listValuesProducts.push({
          value: value.id,
          title: value.name
        });
      });
    });

    this.serviceOrder.get('http://localhost:1337/users/all').then((result) => {
      this.listValuesUsers = [];
      this.users = result;
      this.users.forEach((value) => {
        this.listValuesUsers.push({
          value: value.id,
          title: value.name
        });
      });
    });

    this.serviceOrder.get('http://localhost:1337/orders/all').then((result) => {
      this.data = result;
      this.settings = {
        noDataMessage: 'No data Found.',
        hideSubHeader: false,
        actions: {
          add: false,
          position: 'left'
        },
        edit: {
          editButtonContent: '<i class="material-icons">mode_edit</i>',
          confirmSave: true,
          saveButtonContent: '<i class="material-icons">done</i>',
          cancelButtonContent: '<i class="material-icons">cancel</i>',
        },
        delete: {
          deleteButtonContent: '<i class="material-icons">delete</i>',
          confirmDelete: true
        },
        columns: {
          name: {
            title: 'Name',
            editor: {
              type: 'list',
              config: {
                list: this.listValuesUsers
              }
            },
            filter: {
              inputClass: 'testeeeee'
            }
          },
          product: {
            title: 'Product',
            editor: {
              type: 'list',
              config: {
                list: this.listValuesProducts
              }
            }
          },
          date: {
            editable: false,
            title: 'Date'
          },
          quantity: {
            title: 'Quantity'
          },
          price: {
            editable: false,
            title: 'Price'
          }
        }
      };
        this.source.load(this.data);
      });
    }

    getDate() {
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth()+1;
      let yyyy = today.getFullYear();

      return yyyy+'-'+mm+'-'+dd;
    }

    filterByDay() {
      let todayDay = this.getDate();
      let newListToday = [];

      this.data.filter((x) => { 
        if (x.date.replace(/-0+/g, '-') === todayDay) {
          newListToday.push(x);
          this.source.load(newListToday);
        }
      });
    }

    ngAfterViewInit() {
      setTimeout(() => {
        let name = document.getElementsByClassName('name')['1'];
        name.getElementsByTagName('input')['0'].style.width = '81%';

        let product = document.getElementsByClassName('product')['1'];
        product.getElementsByTagName('input')['0'].style.width = '81%';

        let date = document.getElementsByClassName('date')['1'];
        date.getElementsByTagName('input')['0'].style.width = '81%';

        let qtd = document.getElementsByClassName('quantity')['1'];
        qtd.getElementsByTagName('input')['0'].style.width = '81%';

        let price = document.getElementsByClassName('price')['1'];
        price.getElementsByTagName('input')['0'].style.width = '81%';
      }, 100);
    }

    getAll() {
      this.serviceOrder.get('http://localhost:1337/orders/all').then((result) => {
        this.data = result;
        this.source.load(this.data);
      });
    }

    save() {
      let objToSend = {
        product_id: this.selectedProduct,
        user_id: this.selectedUser,
        quantity: this.selectedQtd
      }

      if (objToSend.user_id == '' || objToSend.product_id == '' || objToSend.quantity == 0 || !objToSend.quantity) {
        swal(
          'Missing parameters',
          'Missing some parameters, please verify.',
          'question'
        )
      } else {
        this.serviceOrder.post('http://localhost:1337/orders', objToSend).then((result) => {
          this.getAll();
        }).catch((err) => {
          if (err) {
            swal(
              'Oops...',
              'Something went wrong!',
              'error'
            );
          }
        });
      }

      this.selectedUser = '';
      this.selectedProduct = '';
      this.selectedQtd = 0;
    }

    deleteRow(row) {
      let service = this.serviceOrder;
      swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then(function(isConfirm) {
        swal(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        );
        service.delete(`http://localhost:1337/orders/${row.data.id}`).then().catch((err) => {
          if (err) {
            swal(
              'Oops...',
              'Something went wrong!',
              'error'
            );
          }
        });
        row.confirm.resolve();
      }, function (dismiss) {
        if (dismiss === 'cancel') {
          swal(
            'Cancelled',
            'Operation cancelled :)',
            'error'
          );
          row.confirm.reject();
        }
      });
    }

    editRow(row) {
      let service = this.serviceOrder;
      let self = this;
      swal({
        title: 'Are you sure?',
        text: "You want update this line?",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Update it!'
    }).then(function(isConfirm) {
        swal(
          'Updated!',
          'Line has been updated.',
          'success'
        );

        let objToUpdate = {
          product_id: row.newData.product,
          user_id: row.newData.name,
          quantity: row.newData.quantity
        }

        service.update(`http://localhost:1337/orders/${row.data.id}`, objToUpdate).then(() => {
          self.getAll();
        }).catch((err) => {
          if (err) {
            swal(
              'Oops...',
              'Something went wrong!',
              'error'
            );
          }
        });
        row.confirm.resolve();
      });
    }
  }
