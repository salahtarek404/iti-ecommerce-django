from django.shortcuts import render
from .models import Product, Order, OrderItem
import json

def home(request):
    return render(request, 'store/home.html')

def about(request):
    return render(request, 'store/about.html')

def contact(request):
    return render(request, 'store/contectus.html')

def product_list(request):
    products = Product.objects.all()
    # Get a list of unique categories to pass to the template
    categories = Product.objects.values_list('category', flat=True).distinct()
    
    return render(request, 'store/product.html', {
        'products': products,
        'categories': categories
    })

def product_detail(request, pk):
    product = Product.objects.get(id=pk)
    return render(request, 'store/product-details.html', {'product': product})

def cart(request):
    return render(request, 'store/cart.html')

def checkout(request):
    if request.method == 'POST':
        # Get data from standard HTML form
        name = request.POST.get('name')
        phone = request.POST.get('phone')
        address = request.POST.get('address')
        total = request.POST.get('total_price')
        
        # Parse the shopping cart data from the hidden input
        cart_data_str = request.POST.get('cart_data')
        cart_items = json.loads(cart_data_str)

        # Create the order in the database
        order = Order.objects.create(
            customer_name=name,
            phone=phone,
            address=address,
            total_price=total
        )

        # Create OrderItems for each product in the cart
        for item in cart_items:
            product = Product.objects.get(id=item['id'])
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item['qty'],
                price=item['price']
            )
        
        # Render the success page
        return render(request, 'store/success.html', {
            'order': order
        })
    
    return render(request, 'store/checkout.html')
